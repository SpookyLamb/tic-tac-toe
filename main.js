// Must Have:
// Game tiles should only be clickable once, and if the game is over they should not be clickable at all. (DONE)
// The game should display who wins the game if someone wins, otherwise, say that the game resulted in a tie (cat). (DONE)
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
let game_over = false;

let boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //9 squares, left to right, top to bottom - 0 is blank, 1 is X, 2 (or above) is O

const game_text = document.getElementById("game-text")
const reset_button = document.getElementById("reset")

function init() {
    addClickEvents()
    reset_button.addEventListener("click", reset)
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
    game_over = false
    boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (let i = 0; i < boardState.length; i++) {
        let element = document.getElementById(String(i))
        element.textContent = "" //clear text
    }

    const random_num = Math.random()

    if (random_num > 0.5) { //x goes first?
        turn_x = true
    } else { //o goes first?
        turn_x = false
    }

    switchTurn() // DRY, lol
}

function click(e) {
    //places an X or an O in the given square based on whos turn it is
    //also updates our state accordingly by grabbing the element id, these are 0-8 to correspond with indexes
    
    if (game_over) {
        return //do nothing
    }
    
    let index = Number(e.target.id)
    if (boardState[index] !== 0) { //can't overwrite a filled space
        return //do nothing
    }

    if (turn_x) {
        e.target.textContent = "X"
        boardState[index] = 1 //X
    } else {
        e.target.textContent = "O"
        boardState[index] = 2 //O
    }

    console.log(boardState)

    checkWin()
}

function checkWin() {
    //checks if a player has won by examining boardState
    //also checks for draws

    //to visualize by index number:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    
    //if at any point it detects a win, it announces it and immediately returns

    //needs to check each row (0,1,2) (3,4,5) (6,7,8)
    for (let i = 0; i < boardState.length; i += 3) {
        if (boardState[i] === 0) { //if a tile is empty, ignore it
            continue;
        }

        if (boardState[i] === boardState[i+1] && boardState[i] === boardState[i+2]) { //victory
            doWin(boardState[i])
            return
        }
    }

    //then each column (0,3,6) (1,4,7) (2,5,8)
    for (let i = 0; i < 3; i++) {
        if (boardState[i] === 0) { //if a tile is empty, ignore it
            continue;
        }

        if (boardState[i] === boardState[i+3] && boardState[i] === boardState[i+6]) {
            doWin(boardState[i])
            return
        }
    }

    //then our diagonals (0,4,8) (2,4,6)
    if (boardState[0] !== 0 && boardState[0] === boardState[4] && boardState[0] === boardState[8]) {
        doWin(boardState[0])
        return
    } else if (boardState[2] !== 0 && boardState[2] === boardState[4] && boardState[2] === boardState[6]) {
        doWin(boardState[2])
        return
    }

    //then check for a draw (all indexes filled (!= 0), no winner from above)
    let draw = true;

    for (let i = 0; i < boardState.length; i++) {
        if (boardState[i] != 0) {
            continue;
        } else {
            draw = false
            break;
        }
    }

    if (draw) {
        doWin(0) //CAT
        return
    }

    switchTurn() //otherwise, switch the turn!
}

function doWin(victor) {
    //displays win text and ends the game
    //"victor" is either 1 for X, 2 for O, or 0 (Cat) if it's a draw
    
    if (victor) { //anything other than 0
        if (victor < 2) { //X win
            game_text.textContent = "X has WON!"
        } else { //O win
            game_text.textContent = "O has WON!"
        }
    } else { //0 is false, Cat
        game_text.textContent = "DRAW! (Cat's Game)"
    }

    game_over = true //require the players to reset
}

function switchTurn() {
    turn_x = !turn_x //flip

    if (turn_x) {
        game_text.textContent = "X to move"
    } else {
        game_text.textContent = "O to move"
    }
}

init()