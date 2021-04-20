from typing import List, Dict

from psycopg2 import sql
from psycopg2._psycopg import cursor
from psycopg2.extras import RealDictCursor
from settings import *

from datetime import date, datetime
import bcrypt

import connection

import persistence_postgres


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    statuses = persistence_postgres.get_statuses()
    return next((status['title'] for status in statuses if status['id'] == str(status_id)), 'Unknown')


def get_boards():
    """
    Gather all boards
    :return:
    """
    return persistence_postgres.get_boards(force=True)


# Boards
def get_board(board_id):
    return persistence_postgres.get_board(board_id, force=True)[0]


def create_board(board):
    board_id = persistence_postgres.create_board(board)

    persistence_postgres.create_column(board_id, 1, 'New')
    persistence_postgres.create_column(board_id, 2, 'In Progress')
    persistence_postgres.create_column(board_id, 3, 'Testing')
    persistence_postgres.create_column(board_id, 4, 'Done')

    return board_id


def delete_board(parameters):
    return persistence_postgres.delete_board(parameters)


def edit_board(parameters):
    return persistence_postgres.edit_board(parameters)


# Columns

def create_column(board_id, name):
    persistence_postgres.create_column(board_id, name)

def get_columns(board_id):
    return persistence_postgres.get_columns(board_id)


def update_column_order(column):
    return persistence_postgres.update_column_order(column["id"], column["order"])


# Cards

def get_cards_for_board(board_id):
    return persistence_postgres.get_cards(board_id)


def create_card(board_id, description):
    persistence_postgres.create_card(board_id, description)


def check_if_login_doesnt_exist(loginame):
    count_login = persistence_postgres.check_login_exist(loginame)
    return True if count_login['count'] == 0 else False


def register_new_user(loginname, password):
    if check_if_login_doesnt_exist(loginname):
        persistence_postgres.register_new_user(loginname, password)
        return True;
    else:
        return False;


def check_user_login_data(loginname, password_encoded_utf8):
    if not check_if_login_doesnt_exist(loginname):
        db_hash_password = persistence_postgres.get_user_password(loginname).get('password')
        db_hash_bytes_password_encoded_utf8 = db_hash_password.encode("UTF-8")
        return bcrypt.checkpw(password_encoded_utf8, db_hash_bytes_password_encoded_utf8)
    else:
        return False


def update_cards_order(card):
    persistence_postgres.update_card_order(card)


def get_card(card_id):
    return persistence_postgres.get_card(card_id)


def get_column_cards(column_id):
    return persistence_postgres.get_column_cards(column_id)


def edit_column(column_id, name):
    persistence_postgres.edit_column(column_id, name)

def delete_column(column_id):
    persistence_postgres.delete_column(column_id)


def edit_card(card_id, description):
    persistence_postgres.edit_card(card_id, description)


def archive_card(card_id):
    persistence_postgres.archive_card(card_id)
