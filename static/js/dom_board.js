// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import { dom } from "./dom.js";
import { domBoards } from "./dom_boards.js";

export let domBoard = {
    init: function () {
        // This function should run once, when the page is loaded.
        let url = "board_templates.html"
        let divId = "templates_board"
        dom.loadTemplates(divId, url)
    },
    getBoard: function(boardId){
         dataHandler.getBoard(boardId, function(board){
            domBoard.showBoard(board);
            domBoard.loadColumns(boardId);
        });

    },
    showBoard: function(board){
        if(board === undefined) return;

        domBoards.hide();

        //put here logic responsible for display board
        let boardDiv = document.querySelector("#display-board");
        let backButton = document.createElement('button')
        backButton.innerText = "Back to boards"
        backButton.classList.add("btn")
        backButton.classList.add("btn-primary")
        backButton.addEventListener('click', ()=>{
            dom.loadBoards()
            dom.hide("#display-board")
        })
        boardDiv.insertAdjacentElement('beforeend', backButton)

        let element = dom.getElementFromTemplate("board_template")
        let board_title = element.querySelector("#board_title")
        board_title.innerText = board.title
        if(board.private){
            board_title.className = "fa fa-lock"
        }else{
             board_title.className = "fa fa-unlock"
        }

        let board_user_id = element.querySelector("#board_user_id")
        board_user_id.innerText = "Board created by " + board.user_id

        let boardIdInput = element.querySelector("#boardIdInput")
        boardIdInput.value = board.id

        let newCardButton = element.querySelector("#add-new-card")
        newCardButton.className = 'btn btn-info btn-lg'
        newCardButton.setAttribute('data-toggle', 'modal');
        newCardButton.setAttribute('data-target', '#createCardModal');

        let newColumnButton = element.querySelector("#add-new-column")
        newColumnButton.className = 'btn btn-info btn-lg'
        newColumnButton.setAttribute('data-toggle', 'modal');
        newColumnButton.setAttribute('data-target', '#createColumnModal');

        let editModal = dom.getElementFromTemplate("editCard_template")
        let btn = editModal.querySelector("#editCardBtn")
        btn.addEventListener("click", (evt => {
            let id = document.getElementById("card_edit_id").value
            let description = document.getElementById("card_edit_description").value

            dataHandler.editCard(id, description, ()=>{
                $('#editCardModal').modal('hide');
                this.loadColumns(document.getElementById("boardIdInput").value)
            })
        }))
        boardDiv.appendChild(editModal)

        let modal = dom.getElementFromTemplate("createCard_template")
        let createCardModalButton = modal.querySelector ("#createCardBtn")
        createCardModalButton.addEventListener('click', (event) => {
            let title = document.getElementById("card_description").value
            let boardId = document.getElementById("boardIdInput").value
            dataHandler.createNewCard(title, boardId, (response) => {
                console.log(response)
                $("#createCardModal").modal('hide');
                document.getElementById("card_description").value = ""
                this.loadColumns(boardId)
            })
        })

        element.appendChild(modal);

        let modalCreateColumn = dom.getElementFromTemplate("createColumn_template")
        let createColumnModalButton = modalCreateColumn.querySelector ("#createColumnBtn")
        createColumnModalButton.addEventListener('click', (event) => {
            let name = document.getElementById("create_column_name").value
            let boardId = document.getElementById("boardIdInput").value
            dataHandler.create_column(boardId, name, (response) => {
                $("#createColumnModal").modal('hide');
                document.getElementById("create_column_name").value = ""
                this.loadColumns(boardId)
            })
        })

        element.appendChild(modalCreateColumn);

        let editColumnModal = dom.getElementFromTemplate("editColumn_template")
        let btnEditColumn = editColumnModal.querySelector("#editColumnBtn")
        btnEditColumn.addEventListener("click", (evt => {
            let id = document.getElementById("column_edit_id").value
            let name = document.getElementById("edit_column_name").value

            dataHandler.edit_column(id, name, ()=>{
                $('#editColumnModal').modal('hide');
                this.loadColumns(document.getElementById("boardIdInput").value)
            })
        }))
        boardDiv.appendChild(editColumnModal)

        boardDiv.appendChild(element)

    },
    loadColumns: function (board_id){
        dataHandler.get_columns(board_id, (columns)=>{
            this.showColumns(columns)
        });
    },
    showColumns: function(columns){
        console.log(columns)

        dom.hide("#myColumns")

        let divColumns = document.getElementById("myColumns")
        let element = dom.getElementFromTemplate("columns_template")
        divColumns.appendChild(element)

        //columnContainer
        let columnContainer = document.getElementById("columnContainer");
        let boardId = document.getElementById("boardIdInput").value

        dataHandler.getCardsByBoardId(boardId, (cards)=>{
        for(let column of columns){
            let cardsForColumn  = cards.filter(function(o){return o.column_id === column.id;} );

            let columnTemplate = dom.getElementFromTemplate("column_template")
            let columnTitle  = columnTemplate.getElementById("columnTitle")
            columnTitle.innerHTML = column.name

            let editColumnBtn = document.createElement("button")
            editColumnBtn.innerText = ""
            editColumnBtn.setAttribute("column_id", column.id)
            editColumnBtn.setAttribute("column_name", column.name)
            editColumnBtn.setAttribute("class", "fa fa-pencil-square-o btn btn-secondary btn-sm")
            editColumnBtn.addEventListener("click", (event)=>{
                //show edit
                    let id = event.target.getAttribute("column_id")
                    let name = event.target.getAttribute("column_name")
                    let editModal = document.querySelector("#editColumnModal")
                    editModal.querySelector("#column_edit_id").value = id
                    editModal.querySelector("#edit_column_name").value = name

                    $('#editColumnModal').modal()
                    $('#editColumnModal').modal('show');
            })
            columnTitle.appendChild(editColumnBtn)

             let archiveBtn = document.createElement("button")
            archiveBtn.innerText = ""
            archiveBtn.setAttribute("column-id", column.id)
            archiveBtn.setAttribute("class", "fa fa-times btn btn-secondary btn-sm")
            archiveBtn.addEventListener("click", (event)=>{
                //show edit
                let id = event.target.getAttribute("column-id")
                dataHandler.delete_column(id, ()=>{
                    this.loadColumns(document.getElementById("boardIdInput").value)
                })
            })
            columnTitle.appendChild(archiveBtn)

            let columnDiv = columnTemplate.firstElementChild
            columnDiv.setAttribute("id", "c"+column.id)
            for(let card of cardsForColumn) {
                let cardDiv = document.createElement("div")
                let cardLabel = document.createElement("label")
                cardLabel.innerText = card.description

                let editBtn = document.createElement("button")
                editBtn.innerText = ""
                editBtn.setAttribute("card-id", card.id)
                editBtn.setAttribute("card-description", card.description)
                editBtn.setAttribute("class", "fa fa-pencil-square-o btn btn-secondary btn-sm")
                editBtn.addEventListener("click", (event)=>{
                    //show edit
                        let id = event.target.getAttribute("card-id")
                        let title = event.target.getAttribute("card-description")
                        let editModal = document.querySelector("#editCardModal")
                        editModal.querySelector("#card_edit_id").value = id
                        editModal.querySelector("#card_edit_description").value = title

                        $('#editCardModal').modal()
                        $('#editCardModal').modal('show');
                })
                cardLabel.appendChild(editBtn)

                 let archiveBtn = document.createElement("button")
                archiveBtn.innerText = ""
                archiveBtn.setAttribute("card-id", card.id)
                archiveBtn.setAttribute("class", "fa fa-times btn btn-secondary btn-sm")
                archiveBtn.addEventListener("click", (event)=>{
                    //show edit
                    let id = event.target.getAttribute("card-id")
                    dataHandler.archiveCard(id, ()=>{
                        this.loadColumns(document.getElementById("boardIdInput").value)
                    })
                })
                cardLabel.appendChild(archiveBtn)

                cardDiv.appendChild(cardLabel)
                cardDiv.setAttribute("id", card.id)
                cardDiv.className = "list-group-item"

                columnDiv.appendChild(cardDiv)
            }
            columnContainer.appendChild(columnTemplate)

            let sortableColumn = document.getElementById('c'+column.id)

            new Sortable(sortableColumn, {
                    swapThreshold: 1,
                    filter: '#columnTitle', // 'filtered' class is not draggable
                    group: 'shared', // set both lists to same group
                    animation: 150,
                    ignore: '.dropdown',
                    // Element dragging ended
                    onEnd: function (evt) {
                        var itemEl = evt.item;  // dragged HTMLElement
                        evt.to;    // target list
                        evt.from;  // previous list
                        evt.oldIndex;  // element's old index within old parent
                        evt.newIndex;  // element's new index within new parent
                        evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
                        evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
                        evt.clone // the clone element
                        evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
                    },
                    onAdd: function (evt) {
                        console.log("Add")
                        console.log( evt)
                        let target_column_id = evt.target.id.replace('c','')
                        let card_id = evt.item.id
                        let card_order = evt.newIndex

                        dataHandler.move_card(card_id, target_column_id, card_order, ()=>{

                        })

                    },
                    // Called by any change to the list (add / update / remove)
                    onSort: function (evt) {
                        // same properties as onEnd
                },
            });

        }

        //Start SortableJs
        new Sortable(columnContainer, {
            swapThreshold: 1,
            animation: 150,
            onUpdate: function (evt) {
                // change columns order
                let colNewIndex = evt.newIndex-1;
                let colOldIndex = evt.oldIndex-1;
                let boardId = document.getElementById("boardIdInput").value
                dataHandler.move_columns(boardId, colOldIndex, colNewIndex, ()=>{

                })
            },

        });
        });


    }
}