// Must Have: (DONE)
// Game tiles should only be clickable once, and if the game is over they should not be clickable at all. (DONE)
// The game should display who wins the game if someone wins, otherwise, say that the game resulted in a tie (cat). (DONE)
// On each player’s turn, that player places their symbol on an unoccupied space by clicking. (DONE)

// Should Have: (DONE)
// The game should let the players know who's turn it is. (DONE)
// There should be a Restart Game button that does not refresh the page (set state). (DONE)

// Could Have: 
// Randomize who goes first (DONE)
// Allow players to enter their names (DONE)
// Keep track of the number of games won by X and O (DONE)
// Save information in local storage (DONE)
// Only have a single <div id="app"></div> in your index.HTML (try to code golf the HTML file) (DONE)
// Add a link to rules, display in a modal
// Selectable themes - different board, background, and alternatives to X/O displays
// Display multiple game boards at once

// Wish List:
// Turn the project into Connect Four
// Recreate Go

let turn_x = true;
let game_over = true;

let p1_name = "X";
let p2_name = "O";

let p1_win_count = 0;
let p2_win_count = 0;

let boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //9 squares, left to right, top to bottom - 0 is blank, 1 is X, 2 (or above) is O

const app = document.getElementById("app");

let game_text, reset_button, p1_input, p2_input, p1_wins, p2_wins;

function init() {
    buildPage()
    addClickEvents()
    
    game_text.textContent = "Enter names, then press START!"
    reset_button.textContent = "START"

    reset_button.addEventListener("click", reset)
    p1_input.addEventListener("input", changeNames)
    p2_input.addEventListener("input", changeNames)

    loadGame()
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

function buildPage() {
    //builds the page from pure JS, using buildElement()
    clearChildElements(app)

    // <div class="container main-wrapper">
    const main_wrapper = buildElement("div", ["container", "main-wrapper"], app) //main parent
    
    //     <div class="row text-center d-flex justify-content-center">
    //         <div class="col-12">
    //             <h1>Tic-Tac-Toe</h1>
    //         <div class="col-6">
    //             <label for="p1-input">P1 Name (X):</label>
    //             <input class="input-field" type="text" id="p1-input" name="p1-input">
    //         <div class="col-6">
    //             <label for="p2-input">P2 Name (O):</label>
    //             <input class="input-field" type="text" id="p2-input" name="p2-input">

    let row = buildElement("div", ["row", "text-center", "d-flex", "justify-content-center"], main_wrapper)

    let parent = buildElement("div", ["col-12"], row)
    let node = buildElement("h1", [], parent)
    node.textContent = "Tic-Tac-Toe"

    parent = buildElement("div", ["col-6"], row)
    node = buildElement("label", [], parent)
    node.for = "p1-input"
    node.textContent = "P1 Name (X):"
    node = buildElement("input", ["input-field"], parent)
    node.type = "text"
    node.id = "p1-input"
    node.name = "p1-input"
    p1_input = node

    parent = buildElement("div", ["col-6"], row)
    node = buildElement("label", [], parent)
    node.for = "p2-input"
    node.textContent = "P2 Name (O):"
    node = buildElement("input", ["input-field"], parent)
    node.type = "text"
    node.id = "p2-input"
    node.name = "p2-input"
    p2_input = node

    //     <div class="row">
    //         <div class="col-12 d-flex mx-auto board-wrapper">
    //             <div class="mx-auto" id="game-board">
    //                 <div class="row board-row">
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center" id="0"></div>
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center col-mid" id="1"></div>
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center" id="2"></div>
    //                 <div class="row board-row row-mid">
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center" id="3"></div>
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center col-mid" id="4"></div>
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center" id="5"></div>
    //                 <div class="row board-row">
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center" id="6"></div>
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center col-mid" id="7"></div>
    //                     <div class="col-4 board-col game-square text-center d-flex flex-column justify-content-center" id="8"></div>

    row = buildElement("div", ["row"], main_wrapper)
    parent = buildElement("div", ["col-12", "d-flex", "mx-auto", "board-wrapper"], row)
    let board = buildElement("div", ["mx-auto"], parent)
    board.id = "game-board"

    const game_square_classes = ["col-4", "board-col", "game-square", "text-center", "d-flex", "flex-column", "justify-content-center"]

    parent = buildElement("div", ["row", "board-row"], board)
    node = buildElement("div", game_square_classes, parent)
    node.id = "0"
    node = buildElement("div", game_square_classes, parent)
    node.classList.add("col-mid")
    node.id = "1"
    node = buildElement("div", game_square_classes, parent)
    node.id = "2"

    parent = buildElement("div", ["row", "board-row", "row-mid"], board)
    node = buildElement("div", game_square_classes, parent)
    node.id = "3"
    node = buildElement("div", game_square_classes, parent)
    node.classList.add("col-mid")
    node.id = "4"
    node = buildElement("div", game_square_classes, parent)
    node.id = "5"

    parent = buildElement("div", ["row", "board-row"], board)
    node = buildElement("div", game_square_classes, parent)
    node.id = "6"
    node = buildElement("div", game_square_classes, parent)
    node.classList.add("col-mid")
    node.id = "7"
    node = buildElement("div", game_square_classes, parent)
    node.id = "8"    

    //     <div class="row text-center">
    //         <p id="game-text">TEXT</p>
    //         <div class="col-12 mx-auto text-center">
    //             <button class="btn btn-primary" id="reset">RESTART</button>
    //             <h2 class="win-count hidden-obj" id="p1-wins">P1 WINS: 0</h2>
    //             <h2 class="win-count hidden-obj" id="p2-wins">P2 WINS: 0</h2>

    row = buildElement("div", ["row", "text-center"], main_wrapper)
    node = buildElement("p", [], row)
    node.id = "game-text"
    game_text = node
    
    parent = buildElement("div", ["col-12", "mx-auto", "text-center"], row)
    node = buildElement("button", ["btn", "btn-primary"], parent)
    node.id = "reset"
    reset_button = node
    node.textContent = "RESTART"

    node = buildElement("h2", ["win-count", "hidden-obj"], parent)
    node.id = "p1-wins"
    node.textContent = "P1 WINS: 0"
    p1_wins = node
    
    node = buildElement("h2", ["win-count", "hidden-obj"], parent)
    node.id = "p2-wins"
    node.textContent = "P2 WINS: 0"
    p2_wins = node

}

function clearChildElements(parentElement) {
    // clears the child elements of a given element
  
    const node_list = Array.from(parentElement.childNodes) //grab a copy of the array to iterate across
    node_list.forEach((element) => element.remove())
}

function changeNames() {
    //console.log("changing names")

    p1_input_value = p1_input.value

    if (p1_name !== p1_input_value) {
        p1_name = p1_input_value
        p1_win_count = 0
    }
    
    if (!p1_name) { //empty string
        p1_name = "X"
    }

    p2_input_value = p2_input.value

    if (p2_name !== p2_input_value) {
        p2_name = p2_input_value
        p2_win_count = 0
    }

    if (!p2_name) {
        p2_name = "O"
    }

    setWinCounts()
    setTurn() //note: doesn't change the turn, just the text
}

function reset() {
    //resets the game to its initial state, including picking a new turn
    reset_button.textContent = "RESTART"
    
    changeNames()

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
    saveGame()
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

    //console.log(boardState)
    
    changeNames() //change names, if they were updated
    checkWin()
    saveGame()
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
            p1_win_count += 1
            game_text.textContent = p1_name + " has WON!"
        } else { //O win
            p2_win_count += 1
            game_text.textContent = p2_name + " has WON!"
        }
    } else { //0 is false, Cat
        game_text.textContent = "DRAW! (Cat's Game)"
    }

    setWinCounts()
    game_over = true //require the players to reset
}

function switchTurn() {
    turn_x = !turn_x //flip
    setTurn()
}

function saveGame() {
    //save game information to local storage so it will show when refreshed

    // needs to store the following vars:
    // turn_x
    // game_over
    // p1_name
    // p2_name
    // p1_win_count
    // p2_win_count
    // boardState

    localStorage.setItem("turn_x", JSON.stringify(turn_x))
    localStorage.setItem("game_over", JSON.stringify(game_over))
    localStorage.setItem("p1_name", JSON.stringify(p1_name))
    localStorage.setItem("p2_name", JSON.stringify(p2_name))
    localStorage.setItem("p1_win_count", JSON.stringify(p1_win_count))
    localStorage.setItem("p2_win_count", JSON.stringify(p2_win_count))
    localStorage.setItem("boardState", JSON.stringify(boardState))
}

function loadGame() {
    //loads all the vars from saveGame()

    if (localStorage.getItem("game_over") === null) { //invalid local storage
        saveGame() //create new storage data from defaults
        return
    }

    turn_x = JSON.parse(localStorage.getItem("turn_x"))
    game_over = JSON.parse(localStorage.getItem("game_over"))
    p1_name = JSON.parse(localStorage.getItem("p1_name"))
    p2_name = JSON.parse(localStorage.getItem("p2_name"))
    p1_win_count = JSON.parse(localStorage.getItem("p1_win_count"))
    p2_win_count = JSON.parse(localStorage.getItem("p2_win_count"))
    boardState = JSON.parse(localStorage.getItem("boardState"))


    //adjusts the visuals to match
    p1_input.value = p1_name
    p2_input.value = p2_name

    setBoardState()
    setTurn()
    setWinCounts()
}

function setTurn() {
    if (game_over) { //only fires if the game loads in a game over state
        game_text.textContent = "GAME OVER! Click START!"
        reset_button.textContent = "START"
        return
    } else {
        reset_button.textContent = "RESTART"
    }
    
    if (turn_x) {
        game_text.textContent = p1_name + " to move"
    } else {
        game_text.textContent = p2_name + " to move"
    }
}

function setWinCounts() {
    p1_wins.textContent = p1_name + " WINS: " + String(p1_win_count)
    p2_wins.textContent = p2_name + " WINS: " + String(p2_win_count)

    p1_wins.classList.remove("hidden-obj") //wins
    p2_wins.classList.remove("hidden-obj") //wins
}

function setBoardState() {
    //only called by loadGame()
    let squares = document.getElementsByClassName("game-square") //should load in the right order, indexes corresponding correctly

    for (let i = 0; i < squares.length; i++) {
        let element = squares.item(i)
        
        if (boardState[i] === 1) { //X
            element.textContent = "X"
        } else if (boardState[i] === 2) { //O
            element.textContent = "O"
        } //else, leave blank
    }
}

init()