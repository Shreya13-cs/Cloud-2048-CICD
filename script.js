const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");

const newGameButton = document.getElementById("new-game");
const tryAgainButton = document.getElementById("try-again");

const gameMessage = document.getElementById("game-message");
const messageText = document.getElementById("message-text");

let grid;
let score = 0;

const SIZE = 4;


// ==============================
// START GAME
// ==============================

function startGame() {

    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;

    scoreDisplay.textContent = score;

    gameMessage.classList.add("hidden");

    addRandomTile();
    addRandomTile();

    drawBoard();
}


// ==============================
// DRAW BOARD
// ==============================

function drawBoard() {

    board.innerHTML = "";

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            const tile = document.createElement("div");

            tile.classList.add("tile");

            const value = grid[row][col];

            if (value !== 0) {

                tile.textContent = value;

                tile.classList.add(`tile-${value}`);
            }

            board.appendChild(tile);
        }
    }
}


// ==============================
// ADD RANDOM TILE
// ==============================

function addRandomTile() {

    const emptyCells = [];

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (grid[row][col] === 0) {

                emptyCells.push({
                    row: row,
                    col: col
                });
            }
        }
    }

    if (emptyCells.length === 0) {
        return;
    }

    const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

    grid[randomCell.row][randomCell.col] =
        Math.random() < 0.9 ? 2 : 4;
}


// ==============================
// REMOVE EMPTY VALUES
// ==============================

function slide(row) {

    return row.filter(value => value !== 0);
}


// ==============================
// MERGE TILES
// ==============================

function merge(row) {

    for (let i = 0; i < row.length - 1; i++) {

        if (row[i] === row[i + 1]) {

            row[i] *= 2;

            score += row[i];

            row[i + 1] = 0;

            i++;
        }
    }

    return row;
}


// ==============================
// PROCESS ONE ROW
// ==============================

function processRow(row) {

    row = slide(row);

    row = merge(row);

    row = slide(row);

    while (row.length < SIZE) {
        row.push(0);
    }

    return row;
}


// ==============================
// MOVE LEFT
// ==============================

function moveLeft() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const oldRow = [...grid[row]];

        grid[row] = processRow(grid[row]);

        if (JSON.stringify(oldRow) !== JSON.stringify(grid[row])) {
            moved = true;
        }
    }

    return moved;
}


// ==============================
// MOVE RIGHT
// ==============================

function moveRight() {

    let moved = false;

    for (let row = 0; row < SIZE; row++) {

        const oldRow = [...grid[row]];

        let reversed = [...grid[row]].reverse();

        reversed = processRow(reversed);

        grid[row] = reversed.reverse();

        if (JSON.stringify(oldRow) !== JSON.stringify(grid[row])) {
            moved = true;
        }
    }

    return moved;
}


// ==============================
// MOVE UP
// ==============================

function moveUp() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        let column = [];

        for (let row = 0; row < SIZE; row++) {
            column.push(grid[row][col]);
        }

        const oldColumn = [...column];

        column = processRow(column);

        for (let row = 0; row < SIZE; row++) {
            grid[row][col] = column[row];
        }

        if (JSON.stringify(oldColumn) !== JSON.stringify(column)) {
            moved = true;
        }
    }

    return moved;
}


// ==============================
// MOVE DOWN
// ==============================

function moveDown() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        let column = [];

        for (let row = 0; row < SIZE; row++) {
            column.push(grid[row][col]);
        }

        const oldColumn = [...column];

        column.reverse();

        column = processRow(column);

        column.reverse();

        for (let row = 0; row < SIZE; row++) {
            grid[row][col] = column[row];
        }

        if (JSON.stringify(oldColumn) !== JSON.stringify(column)) {
            moved = true;
        }
    }

    return moved;
}


// ==============================
// CHECK WIN
// ==============================

function checkWin() {

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (grid[row][col] === 2048) {

                showMessage("🎉 You reached 2048!");

                return true;
            }
        }
    }

    return false;
}


// ==============================
// CHECK GAME OVER
// ==============================

function checkGameOver() {

    // Check for empty cells

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (grid[row][col] === 0) {
                return false;
            }
        }
    }


    // Check horizontal combinations

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE - 1; col++) {

            if (grid[row][col] === grid[row][col + 1]) {
                return false;
            }
        }
    }


    // Check vertical combinations

    for (let row = 0; row < SIZE - 1; row++) {

        for (let col = 0; col < SIZE; col++) {

            if (grid[row][col] === grid[row + 1][col]) {
                return false;
            }
        }
    }

    return true;
}


// ==============================
// SHOW MESSAGE
// ==============================

function showMessage(message) {

    messageText.textContent = message;

    gameMessage.classList.remove("hidden");
}


// ==============================
// HANDLE MOVE
// ==============================

function handleMove(direction) {

    let moved = false;

    if (direction === "left") {
        moved = moveLeft();
    }

    if (direction === "right") {
        moved = moveRight();
    }

    if (direction === "up") {
        moved = moveUp();
    }

    if (direction === "down") {
        moved = moveDown();
    }


    if (moved) {

        addRandomTile();

        scoreDisplay.textContent = score;

        drawBoard();

        if (!checkWin() && checkGameOver()) {
            showMessage("Game Over!");
        }
    }
}


// ==============================
// KEYBOARD CONTROLS
// ==============================

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {

        event.preventDefault();

        handleMove("left");
    }

    else if (event.key === "ArrowRight") {

        event.preventDefault();

        handleMove("right");
    }

    else if (event.key === "ArrowUp") {

        event.preventDefault();

        handleMove("up");
    }

    else if (event.key === "ArrowDown") {

        event.preventDefault();

        handleMove("down");
    }
});


// ==============================
// BUTTONS
// ==============================

newGameButton.addEventListener("click", startGame);

tryAgainButton.addEventListener("click", startGame);


// ==============================
// START
// ==============================

startGame();