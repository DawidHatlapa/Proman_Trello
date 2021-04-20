// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";
import {dom} from "./dom.js";
import {domBoard} from "./dom_board.js";

export let domBoards = {
    init: function () {
        // This function should run once, when the page is loaded.
        let url = "boards_templates.html"
        let divId = "templates_boards"
        dom.loadTemplates(divId, url)
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        this.hide()
        dataHandler.getBoards(function (boards) {
            domBoards.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        let boardsContainer = document.querySelector('#boards');

        //create new board button
        // <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Modal</button>
        let newBoardButton = document.createElement('button');
        newBoardButton.className = 'btn btn-info btn-lg'
        newBoardButton.setAttribute('data-toggle', 'modal');
        newBoardButton.setAttribute('data-target', '#createBoardModal');

        newBoardButton.innerText = "Create new board"
        boardsContainer.insertAdjacentElement('beforeend', newBoardButton)

        let modalTemplate = document.getElementById("createBoard");
        let modal = modalTemplate.content.cloneNode(true)

        let createBoardModalButton = modal.querySelector ("#createBoardBtn")
        createBoardModalButton.addEventListener('click', (event) => {
            let title = document.getElementById("board_title").value
            let isPrivate = document.getElementById("board_private").checked
            dataHandler.createNewBoard(title, isPrivate, (response) => {
                console.log(response)
                $("#createBoardModal").modal('hide');
                this.loadBoards()
            })
        })
        boardsContainer.appendChild(modal);

        let modalEditTemplate = document.getElementById("editBoard");
        let modalEdit = modalEditTemplate.content.cloneNode(true)

        let editBoardModalButton = modalEdit.querySelector ("#editBoardBtn")
        editBoardModalButton.addEventListener('click', (event) => {
            let title = document.getElementById("boardTitle").value
            let id = document.getElementById("boardId").value
            dataHandler.editBoard(id, title, (response) => {
                console.log(response)
                $("#editBoardModal").modal('hide');
                this.loadBoards()
            })

        })
        boardsContainer.appendChild(modalEdit);

        let tableBoardRowTemplate = document.getElementById("tableBoardsRow");
        let tableBoardTemplate = document.getElementById("tableBoards");
        let tables = tableBoardTemplate.content.cloneNode(true);
        let table = tables.querySelector("#boards")

        for (let board of boards) {
            let row = tableBoardRowTemplate.content.cloneNode(true);
            console.log(row)
            let title = row.querySelector('#title')
            title.innerText = board.title;
            title.setAttribute('titleId', board.id)
            title.addEventListener('click', (event) => {
                let id = event.target.getAttribute("titleId")
                domBoard.getBoard(id)
            })
            let privateLabel= row.querySelector('#private')
            if(board.private){
                privateLabel.innerText = " Private";
                privateLabel.className = "fa fa-lock";
            }
            else{
                privateLabel.innerText = "Public";
                privateLabel.className = "fa fa-unlock";
            }
            // row.querySelector('#private').innerText = board.private;
            let deleteBtn = row.querySelector("#delete")
            deleteBtn.setAttribute('boardId', board.id)
            deleteBtn.addEventListener('click', (event)=>{
                let id = event.target.getAttribute("boardId")
                dataHandler.deleteBoard(id, ()=>
                {
                    this.loadBoards()
                })
            })

            let editBtn = row.querySelector("#edit")
            editBtn.setAttribute("boardId", board.id)
            editBtn.setAttribute("boardTitle", board.title)
            editBtn.addEventListener('click', (event)=>{
                let id = event.target.getAttribute("boardId")
                let title = event.target.getAttribute("boardTitle")
                let editModal = document.querySelector("#editBoardModal")
                editModal.querySelector("#boardId").value = id
                editModal.querySelector("#boardTitle").value = title

                //$("#createBoardModal").modal('hide');
                $('#editBoardModal').modal()
                $('#editBoardModal').modal('show');
            })

            table.appendChild(row);

        }
        boardsContainer.appendChild(tables)
    },
    hide: function () {
        dom.hide("#boards");
    }
}