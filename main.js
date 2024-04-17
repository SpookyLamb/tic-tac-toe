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

let turn_x = true;

function init() {
    addClickEvents()
    reset()
}

function addClickEvents() {
    //adds click events to every game-square
    let squares = document.getElementsByClassName("game-square")

    for (let i = 0; i < squares.length; i++) {
        let element = squares.item(i)
        element.addEventListener("click", click)
    }
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
    //resets the game to its initial state, including picking a new turn

    const random_num = Math.random()

    if (random_num > 0.5) { //x goes first
        turn_x = true
    } else { //o goes first
        turn_o = false
    }
}

function click(e) {
    //places an X or an O in the given square based on whos turn it is
    
    if (turn_x) {
        e.target.textContent = "X"
    } else {
        e.target.textContent = "O"
    }

    console.log("CLICK!")
    switchTurn()
}

function checkWin() {
    //also checks for draws
}

function switchTurn() {
    turn_x = !turn_x //flip
}

init()