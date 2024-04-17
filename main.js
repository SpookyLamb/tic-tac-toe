// Must Have:
// Game tiles should only be clickable once, and if the game is over they should not be clickable at all.
// The game should display who wins the game if someone wins, otherwise, say that the game resulted in a tie (cat).  A win happens when one player has 3 symbols in a straight line (horizontal, vertical, or diagonal).
// On each player’s turn, that player places their symbol on an unoccupied space by clicking.

// Should Have:
// The game should let the players know who's turn it is.
// There should be a Restart Game button that does not refresh the page (set state).

// Could Have: 
// Allow players to enter their names
// Keep track of the number of games won by X and O
// Save information in local storage
// Add a link to rules, display in a modal
// Selectable themes - different board, background, and alternatives to X/O displays
// Only have a single <div id="app"></div> in your index.HTML (try to code golf the HTML file)
// Randomize who goes first
// Display multiple game boards at once

// Wish List:
// Turn the project into Connect Four
// Recreate Go

function init() {

}

function buildElement(tag, class_list, parent_node) {
    //takes tag (string), class_list (array of strings), element_id (string)
    //return the created node to be used elsewhere

    let node = document.createElement(tag)

    if (class_list.length > 0) { //empty array is ignored
        for (let i = 0; i < class_list.length; i++) {
            node.classList.add( class_list[i] )
        }
    }

    parent_node.appendChild(node)

    return node
}

function reset() {

}

function click() {

}

function checkWin() {
    //also checks for draws
}

function switchTurn() {

}

init()