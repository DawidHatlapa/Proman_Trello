from datetime import datetime

from psycopg2._psycopg import cursor

from connection import *
import time
import os
import util
from typing import List, Dict

from psycopg2 import sql
from psycopg2.extras import RealDictCursor, RealDictRow, DictCursor
from psycopg2.extensions import AsIs

import connection

#Boards
@connection.connection_handler
def get_boards(cursor: RealDictCursor, force=False):
    query = """
            SELECT *
            FROM boards """
    cursor.execute(query)
    return cursor.fetchall()

    #return _get_data('boards', BOARDS_FILE, force)

@connection.connection_handler
def get_board(cursor: RealDictCursor, board_id, force=False):
    query = """
        SELECT id, title, user_id, private
        FROM boards
        WHERE id = %(board_id)s"""
    param = {'board_id': board_id}
    cursor.execute(query, param)
    return cursor.fetchall()

@connection_handler
def create_board(cursor: RealDictCursor, board):
    command = """
        
        INSERT INTO boards (id, title, "private" , user_id)
        VALUES (COALESCE((select max(id) from boards),0)+1,  %(title)s, %(private)s, %(user_id)s);
        
        SELECT MAX(id) as id FROM boards;
       
    """

    param = {
        'title': board['title'],
        'private': board['private'],
        'user_id': board['user_id']
    }
    cursor.execute(command, param)
    result = cursor.fetchall()
    return result[0]['id']

@connection_handler
def delete_board(cursor: RealDictCursor, parameters):
    command = """
        DO $$                  
        BEGIN
            IF EXISTS(SELECT 1 
                FROM boards
                where id = %(board_id)s and (private = false or (private = true and user_id = %(user_id)s))
                )
            THEN
                        DELETE FROM cards
                        where column_id in (select id from columns where board_id = %(board_id)s );
            
                        DELETE FROM columns
                        where board_id = %(board_id)s;
                    
                        DELETE FROM boards
                        where id = %(board_id)s and (private = false or (private = true and user_id = %(user_id)s));
                        
            END IF;        
        END
        $$ ;
    """
    param = {
        'board_id': parameters['board_id'],
        'user_id': parameters['user_id']
    }
    cursor.execute(command, param)

@connection_handler
def edit_board(cursor: RealDictCursor, parameters):
    command = """
        UPDATE boards
        SET title = %(board_title)s
        where id = %(board_id)s and (private = false or (private = true and user_id = %(user_id)s))
    """
    param = {
        'board_id': parameters['id'],
        'user_id': parameters['user_id'],
        'board_title': parameters['title']
    }
    cursor.execute(command, param)

#Columns
@connection_handler
def create_column(cursor: RealDictCursor, board_id, order, name):
    command = """
            INSERT INTO columns (id, board_id, "order", name)
            VALUES (COALESCE((select max(id) from columns),0)+1,  %(board_id)s, %(order)s, %(name)s);
        """

    param = {
        'board_id': board_id,
        'order': order,
        'name': name
    }

    cursor.execute(command, param)

@connection_handler
def create_column(cursor: RealDictCursor, board_id, name):
    command = """
            INSERT INTO columns (id, board_id, "order", name)
            VALUES (COALESCE((select max(id) from columns),0)+1,  %(board_id)s, COALESCE((select max(id) from columns where board_id = %(board_id)s),0)+1, %(name)s);
        """

    param = {
        'board_id': board_id,
        'name': name
    }

    cursor.execute(command, param)

@connection_handler
def get_columns(cursor: RealDictCursor, board_id):
    command = """
            SELECT id, name,"order"
            FROM columns
            WHERE board_id = %(board_id)s
            ORDER BY "order";
        """

    param = {
        'board_id': board_id,
    }

    cursor.execute(command, param)
    return cursor.fetchall()

#Users
@connection_handler
def check_login_exist(cursor: RealDictCursor, loginame):
    command = """
        SELECT count(*)
        FROM users
        WHERE login = %(login)s
    """
    param = {
        "login": loginame
    }
    cursor.execute(command, param)
    return cursor.fetchone()

@connection_handler
def register_new_user(cursor: RealDictCursor, loginname, password):
    command = """
        INSERT INTO users(login, password)
        VALUES (%(loginname)s, %(password)s)
        RETURNING *
    """
    param = {
        "loginname": loginname,
        "password": password
        }
    cursor.execute(command, param)

@connection_handler
def get_user_password(cursor: RealDictCursor, loginname):
    command = """
        SELECT password
        FROM users
        WHERE login = %(login)s
    """
    param = {
        "login": f"{loginname}",
    }
    cursor.execute(command, param)
    return cursor.fetchone()

@connection_handler
def update_column_order(cursor: RealDictCursor, id, order):
    command = """
            UPDATE columns
            SET
                "order" = %(order)s
            WHERE id = %(id)s
        """
    param = {
        "id": id,
        "order": order
    }
    cursor.execute(command, param)

@connection_handler
def get_cards(cursor: RealDictCursor, boardId):
    command = """
            SELECT cards.id, description, column_id, cards."order", archived
            FROM cards, columns
            WHERE cards.column_id = columns.id and board_id = %(board_id)s and archived = False
        """
    param = {
        "board_id": f"{boardId}",
    }
    cursor.execute(command, param)
    return cursor.fetchall()


@connection_handler
def create_card(cursor: RealDictCursor, boardId, description):
    command = """
             INSERT INTO cards (id, description, column_id, "order", archived)
            VALUES (COALESCE((select max(id) from cards),0)+1, 
            %(description)s,             
             (select min(id) from columns where board_id = %(board_id)s),             
              COALESCE((select max("order") from cards where column_id in ((select min(id) from columns where board_id = %(board_id)s)) ),0)+1, 
             False);
        """
    param = {
        "board_id": boardId,
        "description": description
    }
    cursor.execute(command, param)

@connection_handler
def get_column_cards(cursor: RealDictCursor, column_id):
    command = """
               SELECT id, description, column_id, "order", archived
               FROM cards
               WHERE column_id = %(column_id)s and archived = False
           """
    param = {
        "column_id": f"{column_id}",
    }
    cursor.execute(command, param)
    return cursor.fetchall()

@connection_handler
def get_card(cursor: RealDictCursor, card_id):
    command = """
                  SELECT id, description, column_id, "order", archived
                  FROM cards
                  WHERE id = %(card_id)s 
              """
    param = {
        "card_id": f"{card_id}",
    }
    cursor.execute(command, param)
    return cursor.fetchone()

@connection_handler
def edit_column(cursor: RealDictCursor, column_id, name):
    command = """
                    UPDATE columns
                    SET
                        name = %(name)s
                    WHERE id = %(id)s
                """
    param = {
        "id": column_id,
        "name": name
    }
    cursor.execute(command, param)

@connection_handler
def delete_column(cursor: RealDictCursor, column_id):
    command = """
                    DELETE FROM cards
                    WHERE column_id = %(id)s;
                    
                    DELETE FROM columns
                    WHERE id = %(id)s
                """
    param = {
        "id": column_id
    }
    cursor.execute(command, param)

@connection_handler
def update_card_order(cursor: RealDictCursor, card):
    command = """
                UPDATE cards
                SET
                    column_id = %(column_id)s,
                    "order" = %(order)s
                WHERE id = %(id)s
            """
    param = {
        "id": card["id"],
        "order": card["order"],
        "column_id": card["column_id"]
    }
    cursor.execute(command, param)

@connection_handler
def edit_card(cursor: RealDictCursor, card_id, description):
    command = """
                    UPDATE cards
                    SET
                        description = %(description)s
                    WHERE id = %(id)s
                """
    param = {
        "id": card_id,
        "description": description
    }
    cursor.execute(command, param)

@connection_handler
def archive_card(cursor: RealDictCursor, card_id):
    command = """
                    UPDATE cards
                    SET
                        archived = True
                    WHERE id = %(id)s
                """
    param = {
        "id": card_id
    }
    cursor.execute(command, param)