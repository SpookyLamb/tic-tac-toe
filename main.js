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
// Add a link to rules, display in a modal (DONE)
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

let game_text, reset_button, rules_button, switch_game_button, p1_input, p2_input, p1_wins, p2_wins;

//Connect 4 vars
let connect_4 = false; //false by default, determines if the game is currently c4 or TTT
let c4_p1_win_count = 0;
let c4_p2_win_count = 0; //connect 4 win counts are distinct

function init() {
    buildPage()
    game_text.textContent = "Enter names, then press START!"
    reset_button.textContent = "START"
    loadGame()
}

function addEvents() {
    //adds click events to every game-square
    let squares = document.getElementsByClassName("game-square")

    for (let i = 0; i < squares.length; i++) {
        let element = squares.item(i)
        element.addEventListener("click", click)
    }

    reset_button.addEventListener("click", reset)
    rules_button.addEventListener("click", buildRules)
    switch_game_button.addEventListener("click", switchGame)
    p1_input.addEventListener("input", changeNames)
    p2_input.addEventListener("input", changeNames)
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
    
    parent = buildElement("div", ["col-6", "mx-auto", "text-center", "d-flex", "justify-content-end"], row)
    node = buildElement("button", ["btn", "btn-primary", "my-buttons"], parent)
    node.id = "rules"
    rules_button = node
    node.textContent = "RULES"

    parent = buildElement("div", ["col-6", "mx-auto", "text-center", "d-flex", "justify-content-start"], row)
    node = buildElement("button", ["btn", "btn-primary", "my-buttons"], parent)
    node.id = "reset"
    reset_button = node
    node.textContent = "RESTART"

    parent = buildElement("div", ["col-12", "mx-auto", "text-center", "d-flex", "justify-content-center"], row)
    node = buildElement("button", ["btn", "btn-primary", "my-buttons"], parent)
    node.id = "switch-game"
    switch_game_button = node
    node.textContent = "CONNECT 4"

    parent = buildElement("div", ["col-12", "mx-auto", "text-center"], row)
    node = buildElement("h2", ["win-count", "hidden-obj"], parent)
    node.id = "p1-wins"
    node.textContent = "P1 WINS: 0"
    p1_wins = node
    
    node = buildElement("h2", ["win-count", "hidden-obj"], parent)
    node.id = "p2-wins"
    node.textContent = "P2 WINS: 0"
    p2_wins = node

    addEvents()
}

function buildRules() {
    //builds and displays the rrrrrrrrrules page

    clearChildElements(app) //clear out any existing elements

    const main_wrapper = buildElement("div", ["container", "main-wrapper"], app) //main parent

    //title row
    let row = buildElement("div", ["row", "text-center", "d-flex", "justify-content-center"], main_wrapper)

    let parent = buildElement("div", ["col-12"], row)
    let node = buildElement("h1", [], parent)
    node.textContent = "Tic-Tac-Toe Rules"

    //rules text row
    row = buildElement("div", ["row", "text-center", "d-flex", "justify-content-center"], main_wrapper)

    parent = buildElement("div", ["col-10", "rules-box"], row)
    node = buildElement("p", ["text-start", "fs-5"], parent)
    node.textContent = `Tic-tac-toe is played by two players on a three-by-three grid, who alternate placing marks (Xs and Os) in the empty spaces of the grid! The first player who gets three of their marks in a row (orthogonally or diagonally) wins! If all nine spaces are occupied and neither player has won, it's a Draw (or "Cat's Game")!`

    //return button row
    row = buildElement("div", ["row", "text-center"], main_wrapper)
    
    parent = buildElement("div", ["col-12", "mx-auto", "text-center"], row)
    node = buildElement("button", ["btn", "btn-primary", "my-buttons"], parent)
    node.id = "return"
    node.textContent = "PLAY"
    node.addEventListener("click", init)
}

function clearChildElements(parentElement) {
    // clears the child elements of a given element
  
    const node_list = Array.from(parentElement.childNodes) //grab a copy of the array to iterate across
    node_list.forEach((element) => element.remove())
}

function changeNames() {

    p1_input_value = p1_input.value

    if (p1_name !== p1_input_value) {
        p1_name = p1_input_value
        p1_win_count = 0
        c4_p1_win_count = 0
    }
    
    if (!p1_name) { //empty string
        p1_name = "X"
    }

    p2_input_value = p2_input.value

    if (p2_name !== p2_input_value) {
        p2_name = p2_input_value
        p2_win_count = 0
        c4_p2_win_count = 0
    }

    if (!p2_name) {
        p2_name = "O"
    }

    setWinCounts()
    setTurn() //note: doesn't change the turn, just the text
    saveGame()
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

    if (localStorage.getItem("boardState") === null) { //invalid local storage
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

    if (connect_4) {
        p1_wins.textContent = p1_name + " WINS: " + String(c4_p1_win_count)
        p2_wins.textContent = p2_name + " WINS: " + String(c4_p2_win_count)
    } else {
        p1_wins.textContent = p1_name + " WINS: " + String(p1_win_count)
        p2_wins.textContent = p2_name + " WINS: " + String(p2_win_count)
    }

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

//CONNECT 4 METHODS BELOW THIS POINT

let connect4BoardState = {
    col0: [],
    col1: [],
    col2: [],
    col3: [],
    col4: [],
    col5: [], //each of these contain only 1s (for red) and 0s (for blue), blank squares simply aren't represented
}

function switchGame() {
    if (connect_4) { //switch to TTT
        connect_4 = !connect_4 //flip
        init()
    } else { //switch to C4
        connect_4 = !connect_4 //flip
        initConnect4()
    }
}

function initConnect4() {
    buildConnect4()
    game_text.textContent = "Enter names, then press START!"
    reset_button.textContent = "START"
    loadConnect4()
}

function buildConnect4() {
    //this is very similar to buildPage but with added columns/rows
    //builds the page from pure JS, using buildElement()
    clearChildElements(app)

    // main wrapper
    const main_wrapper = buildElement("div", ["container", "main-wrapper"], app) //main parent
    
    //header

    let row = buildElement("div", ["row", "text-center", "d-flex", "justify-content-center"], main_wrapper)

    let parent = buildElement("div", ["col-12"], row)
    let node = buildElement("h1", [], parent)
    node.textContent = "Connect Four"

    //inputs, nearly identical to ttt
    parent = buildElement("div", ["col-6"], row)
    node = buildElement("label", [], parent)
    node.for = "p1-input"
    node.textContent = "P1 Name (Red):"
    node = buildElement("input", ["input-field"], parent)
    node.type = "text"
    node.id = "p1-input"
    node.name = "p1-input"
    p1_input = node

    parent = buildElement("div", ["col-6"], row)
    node = buildElement("label", [], parent)
    node.for = "p2-input"
    node.textContent = "P2 Name (Blue):"
    node = buildElement("input", ["input-field"], parent)
    node.type = "text"
    node.id = "p2-input"
    node.name = "p2-input"
    p2_input = node

    //game board, VERY different from TTT
    //board is 6 col x 5 rows (normally 7x6 but that doesn't divide evenly), aka TERRIBLE, TOO MANY DIVS but fine

    row = buildElement("div", ["row"], main_wrapper)
    parent = buildElement("div", ["col-12", "d-flex", "mx-auto", "board-wrapper"], row)
    let board = buildElement("div", ["mx-auto"], parent)
    board.id = "game-board"

    const game_square_classes = ["col-2", "c4-col", "game-square", "text-center", "d-flex", "flex-column", "justify-content-center"]
    const game_row_classes = ["row", "c4-row"]


    //row 5
    parent = buildElement("div", game_row_classes, board)
    node = buildElement("div", game_square_classes, parent)
    node.id = "4"
    node = buildElement("div", game_square_classes, parent)
    node.id = "14"
    node = buildElement("div", game_square_classes, parent)
    node.id = "24"
    node = buildElement("div", game_square_classes, parent)
    node.id = "34"
    node = buildElement("div", game_square_classes, parent)
    node.id = "44"
    node = buildElement("div", game_square_classes, parent)
    node.id = "54"

    //row 4
    parent = buildElement("div", game_row_classes, board)
    node = buildElement("div", game_square_classes, parent)
    node.id = "3"
    node = buildElement("div", game_square_classes, parent)
    node.id = "13"
    node = buildElement("div", game_square_classes, parent)
    node.id = "23"
    node = buildElement("div", game_square_classes, parent)
    node.id = "33"
    node = buildElement("div", game_square_classes, parent)
    node.id = "43"
    node = buildElement("div", game_square_classes, parent)
    node.id = "53"

    //row 3
    parent = buildElement("div", game_row_classes, board)
    node = buildElement("div", game_square_classes, parent)
    node.id = "2"
    node = buildElement("div", game_square_classes, parent)
    node.id = "12"
    node = buildElement("div", game_square_classes, parent)
    node.id = "22"
    node = buildElement("div", game_square_classes, parent)
    node.id = "32"
    node = buildElement("div", game_square_classes, parent)
    node.id = "42"
    node = buildElement("div", game_square_classes, parent)
    node.id = "52"

    //row 2
    parent = buildElement("div", game_row_classes, board)
    node = buildElement("div", game_square_classes, parent)
    node.id = "1"
    node = buildElement("div", game_square_classes, parent)
    node.id = "11"
    node = buildElement("div", game_square_classes, parent)
    node.id = "21"
    node = buildElement("div", game_square_classes, parent)
    node.id = "31"
    node = buildElement("div", game_square_classes, parent)
    node.id = "41"
    node = buildElement("div", game_square_classes, parent)
    node.id = "51"

    //row 1
    parent = buildElement("div", game_row_classes, board)
    node = buildElement("div", game_square_classes, parent)
    node.id = "0"
    node = buildElement("div", game_square_classes, parent)
    node.id = "10"
    node = buildElement("div", game_square_classes, parent)
    node.id = "20"
    node = buildElement("div", game_square_classes, parent)
    node.id = "30"
    node = buildElement("div", game_square_classes, parent)
    node.id = "40"
    node = buildElement("div", game_square_classes, parent)
    node.id = "50"

    //footer and buttons, similar to TTT

    row = buildElement("div", ["row", "text-center"], main_wrapper)
    node = buildElement("p", [], row)
    node.id = "game-text"
    game_text = node
    
    parent = buildElement("div", ["col-6", "mx-auto", "text-center", "d-flex", "justify-content-end"], row)
    node = buildElement("button", ["btn", "btn-primary", "my-buttons"], parent)
    node.id = "rules"
    rules_button = node
    node.textContent = "RULES"

    parent = buildElement("div", ["col-6", "mx-auto", "text-center", "d-flex", "justify-content-start"], row)
    node = buildElement("button", ["btn", "btn-primary", "my-buttons"], parent)
    node.id = "reset"
    reset_button = node
    node.textContent = "RESTART"

    parent = buildElement("div", ["col-12", "mx-auto", "text-center", "d-flex", "justify-content-center"], row)
    node = buildElement("button", ["btn", "btn-primary", "my-buttons"], parent)
    node.id = "switch-game"
    switch_game_button = node
    node.textContent = "TIC-TAC-TOE"

    parent = buildElement("div", ["col-12", "mx-auto", "text-center"], row)
    node = buildElement("h2", ["win-count", "hidden-obj"], parent)
    node.id = "p1-wins"
    node.textContent = "P1 WINS: 0"
    p1_wins = node
    
    node = buildElement("h2", ["win-count", "hidden-obj"], parent)
    node.id = "p2-wins"
    node.textContent = "P2 WINS: 0"
    p2_wins = node

    addConnect4Events()
}

function addConnect4Events() {
    //adds click events to every game-square

    let squares = document.getElementsByClassName("game-square")

    for (let i = 0; i < squares.length; i++) {
        let element = squares.item(i)
        element.addEventListener("click", clickConnect4)
    }

    reset_button.addEventListener("click", resetConnect4)
    rules_button.addEventListener("click", buildConnect4Rules)
    switch_game_button.addEventListener("click", switchGame)
    p1_input.addEventListener("input", changeNames)
    p2_input.addEventListener("input", changeNames)
}

function clickConnect4(e) {
    //takes and identifies the overall COLUMN that was clicked (not literal col) and then fills in the bottom-most unfilled column
    //updates the game state accordingly
    if (game_over) {
        return //do nothing
    }
    
    //identify the column via the given ids
    const column_num = Math.floor((Number(e.target.id) / 10)) //ignores the ones place, 10s place IDs our column

    //check the corresponding column in the connect4BoardState object
    const column_id = "col" + String(column_num)
    let column_arr = connect4BoardState[column_id]

    //there are a maximum of 5 rows, so if the array is already length 5, ignore
    if (column_arr.length > 4) {
        return //invalid move, do nothing
    }

    //otherwise, check turn_x and push the right value to the array and save it

    if (turn_x) {
        column_arr.push(1)
    } else {
        column_arr.push(0)
    }
    connect4BoardState[column_id] = column_arr
    
    drawConnect4Board()
    checkConnect4Win()
    saveConnect4()
}

function resetConnect4() {
    //resets the game to its initial state, including picking a new turn

    reset_button.textContent = "RESTART"
    
    changeNames()

    game_over = false
    connect4BoardState = {
        col0: [],
        col1: [],
        col2: [],
        col3: [],
        col4: [],
        col5: [],
    }

    drawConnect4Board() //redraw the board

    const random_num = Math.random()

    if (random_num > 0.5) { //red goes first?
        turn_x = true
    } else { //blue goes first?
        turn_x = false
    }

    switchTurn() // DRY, lol
    saveConnect4()
}

function drawConnect4Board() {
    //takes the data in connect4BoardState and colors the squares accordingly
    //TRUE is red, BLUE is false, no data is empty

    for (let i = 0; i < 6; i++) { //6 columns, counting from 0
        const column_arr = connect4BoardState["col" + String(i)] //grab our columns, one by one

        if (column_arr.length == 0) { //empty column
            for (let j = 0; j < 5; j++) {
                const element = document.getElementById( String(i * 10 + j) ) //get our element
                element.classList.remove("c4-red")
                element.classList.remove("c4-blue") //reset    
            }
            continue
        }

        for (let j = 0; j < column_arr.length; j++) { //nested loop, colors our squares from bottom to top (they're pushed in that order!)
            const element = document.getElementById( String(i * 10 + j) ) //get our element
            element.classList.remove("c4-red")
            element.classList.remove("c4-blue") //reset

            if (column_arr[j]) { //draw the correct color
                element.classList.add("c4-red")
            } else {
                element.classList.add("c4-blue")
            }
        }
    }
}

function checkConnect4Win() {
    //checks if a player has won by examining connect4BoardState
    //also checks for draws    
    //if at any point it detects a win, it announces it and immediately returns

    //grab all of our data for easy recall
    const col0 = connect4BoardState.col0
    const col1 = connect4BoardState.col1
    const col2 = connect4BoardState.col2
    const col3 = connect4BoardState.col3
    const col4 = connect4BoardState.col4
    const col5 = connect4BoardState.col5
    const col_arr = [col0, col1, col2, col3, col4, col5] //nested arrays

    //go down our columns, grabbing any valid values (0 and 1) and then checking adjacent values (ortho and diagonal), up to 3 places
    //to visualize:
    
    // 4, 14, 24, 34, 44, 54
    // 3, 13, 23, 33, 43, 53
    // 2, 12, 22, 32, 42, 52
    // 1, 11, 21, 31, 41, 51
    // 0, 10, 20, 30, 40, 50

    //10s place is our column (outer index), 1s place is our row (nested index)

    for (let i = 0; i < col_arr.length; i++) {
        let current_col = col_arr[i]

        for (let j = 0; j < current_col.length; j++) { //nested loop

            //anything that pops up in her is a valid value IN THAT COLUMN, so now we need to check the others, up to 3 places
            let check = current_col[j]

            //check our column, only need to do this in one direction (up)
            if (current_col.length >= j+3 && j < 2) { //don't bother if it's too short or we're too far up
                if (check == current_col[j+1] && check == current_col[j+2] && check == current_col[j+3]) {
                    doConnect4Win(check)
                    return
                }
            }

            //otherwise, check our rows, only need to do this in one direction (right)
            if (i < 3) { //don't bother with either our rows or diagonals if we don't have enough columns left
                if (j < col_arr[i+1].length && j < col_arr[i+2].length && j < col_arr[i+3].length) { //also don't bother if any of the columns are too short
                    if (check == col_arr[i+1][j] && check == col_arr[i+2][j] && check == col_arr[i+3][j]) {
                        doConnect4Win(check)
                        return
                    }
                }
            
                //and then (dear god)... our diagonals
                //we have to do this in TWO directions (up and down) but thankfully can still go from left to right
                //thankfully the logic is similar

                //diagonal UP
                if (j < 2) { //don't bother if we're too far up
                    if (j+1 < col_arr[i+1].length && j+2 < col_arr[i+2].length && j+3 < col_arr[i+3].length) { //length checks
                        if (check == col_arr[i+1][j+1] && check == col_arr[i+2][j+2] && check == col_arr[i+3][j+3]) {
                            doConnect4Win(check)
                            return
                        }
                    }
                }
            
                //diagonal DOWN
                if (j > 2) { //don't bother if we're too far down (fuck you row 2)
                    if (j-1 < col_arr[i+1].length && j-2 < col_arr[i+2].length && j-3 < col_arr[i+3].length) { //SPICY length checks
                        if (check == col_arr[i+1][j-1] && check == col_arr[i+2][j-2] && check == col_arr[i+3][j-3]) {
                            doConnect4Win(check)
                            return
                        }
                    }
                }
            }
        }
    }

    //then check for a draw (all squares filled with no winner from above)

    switchTurn() //otherwise, switch the turn!
}

function doConnect4Win(victor) {
    //displays win text and ends the game
    //"victor" is either 1 for Red, 0 for Blue, or 2 if it's a draw
    //yes this is different from TTT, don't JUDGE me
    
    if (victor == 1) { //red win
        c4_p1_win_count += 1
        game_text.textContent = p1_name + " has WON!"
    } else if (victor == 0) { //blue win
        c4_p2_win_count += 1
        game_text.textContent = p2_name + " has WON!"
    } else { //draw
        game_text.textContent = "DRAW!"
    }

    setWinCounts()
    game_over = true //require the players to reset
}

function buildConnect4Rules() {
    //builds and displays the OTHER rrrrrrrrrules page

    clearChildElements(app) //clear out any existing elements

    const main_wrapper = buildElement("div", ["container", "main-wrapper"], app) //main parent

    //title row
    let row = buildElement("div", ["row", "text-center", "d-flex", "justify-content-center"], main_wrapper)

    let parent = buildElement("div", ["col-12"], row)
    let node = buildElement("h1", [], parent)
    node.textContent = "Connect 4 Rules"

    //rules text row
    row = buildElement("div", ["row", "text-center", "d-flex", "justify-content-center"], main_wrapper)

    parent = buildElement("div", ["col-10", "rules-box"], row)
    node = buildElement("p", ["text-start", "fs-5"], parent)
    node.textContent = `In this version of Connect Four, players choose a color and then take turns dropping colored tokens into a five-row, six-column vertical grid! Pieces fall straight down, occupying the lowest possible space in a column! You win if you're the first to form a horizontal, vertical, or diagonal line of four of your own tokens!`

    //return button row
    row = buildElement("div", ["row", "text-center"], main_wrapper)
    
    parent = buildElement("div", ["col-12", "mx-auto", "text-center"], row)
    node = buildElement("button", ["btn", "btn-primary", "my-buttons"], parent)
    node.id = "return"
    node.textContent = "PLAY"
    node.addEventListener("click", initConnect4)
}

function saveConnect4() {
    // needs to store the following vars:
    // turn_red - loaded shared/saved distinct
    // c4_game_over - loaded shared/saved distinct
    // p1_name - shared
    // p2_name - shared
    // c4_p1_win_count - distinct
    // c4_p2_win_count - distinct
    // connect4BoardState -distinct

    localStorage.setItem("turn_red", JSON.stringify(turn_x))
    localStorage.setItem("c4_game_over", JSON.stringify(game_over))
    localStorage.setItem("p1_name", JSON.stringify(p1_name))
    localStorage.setItem("p2_name", JSON.stringify(p2_name))
    localStorage.setItem("c4_p1_win_count", JSON.stringify(c4_p1_win_count))
    localStorage.setItem("c4_p2_win_count", JSON.stringify(c4_p2_win_count))
    localStorage.setItem("connect4BoardState", JSON.stringify(connect4BoardState))
}

function loadConnect4() {
    //loads connect 4 data

    if (localStorage.getItem("connect4BoardState") === null) { //invalid local storage
        saveConnect4() //create new storage data from defaults
        loadConnect4()
        return
    }

    turn_x = JSON.parse(localStorage.getItem("turn_red"))
    game_over = JSON.parse(localStorage.getItem("c4_game_over"))
    p1_name = JSON.parse(localStorage.getItem("p1_name"))
    p2_name = JSON.parse(localStorage.getItem("p2_name"))
    c4_p1_win_count = JSON.parse(localStorage.getItem("c4_p1_win_count"))
    c4_p2_win_count = JSON.parse(localStorage.getItem("c4_p2_win_count"))
    connect4BoardState = JSON.parse(localStorage.getItem("connect4BoardState"))


    //adjusts the visuals to match
    p1_input.value = p1_name
    p2_input.value = p2_name

    drawConnect4Board()
    setTurn()
    setWinCounts()
}