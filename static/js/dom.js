// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";
import { domBoards } from "./dom_boards.js";
import { domBoard } from "./dom_board.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        domBoards.init();
        domBoard.init();
    },
    loadBoards: function () {
        domBoards.loadBoards();
    },
    hide: function(selector){
        let boards = document.querySelector(selector)
        while (boards.hasChildNodes())
            boards.removeChild(boards.lastChild)
    },
    loadTemplates: function (divId, url){
        let templates = document.getElementById("templates")
        let templates_div = document.createElement("div")
        templates_div.id = divId

        url = "static/html_templates/" + url

        fetch(url)
            .then(function (response) {
                return response.text()
            })
            .then(function (html) {
                templates_div.innerHTML = html
            })
        templates.appendChild(templates_div)
    },
    getElementFromTemplate: function (template_id){
         let template = document.getElementById(template_id);
         return template.content.cloneNode(true)
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
};
