const date = document.getElementById("date");
date.innerText = new Date().getFullYear();
const header = document.querySelector("header");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const mainHeight = header.offsetHeight + footer.offsetHeight;
main.style.cssText = `min-height: calc(100vh - ${mainHeight}px); flex-direction: column; gap: 20px;`;
const primaryCont = document.getElementById("primary-container");
const secondaryCont = document.getElementById("secondary-container");
const ternaryCont = document.getElementById("ternary-container");
const humanBtn = document.getElementById("human-btn");
const aiBtn = document.getElementById("ai-btn");
const twoPlayersForm = document.getElementById("two-player");
const player1Name = document.getElementById("name1");
const player1Sign = document.getElementById("sign1");
const player2Name = document.getElementById("name2");
const player2Sign = document.getElementById("sign2");
const warning = document.getElementById("warning");
const preTernary = document.getElementById("pre-ternary");
const postTernary = document.getElementById("post-ternary");
const form = document.getElementById("form");
let twoPlayerEnabled = false;
let player1 = {}, player2 = {};

humanBtn.addEventListener("click", () => {
    primaryCont.style.display = "none";
    secondaryCont.style.display = "flex";
    twoPlayerEnabled = true;
});

aiBtn.addEventListener("click", () => {
    primaryCont.style.display = "none";
    secondaryCont.style.display = "flex";
    player2Name.removeAttribute("required");
    player2Sign.removeAttribute("required");
    twoPlayersForm.style.display = "none";
});

function getGameBoard() {
    let boxes = [];
    for (let i = 0; i < 9; i++) {
        boxes[i] = document.createElement("div");
        boxes[i].setAttribute("id", `box${i}`);
        boxes[i].classList.add("box");
    }
    return boxes;
}

function createPlayer(name, sign) {
    let playerName = name;
    let playerSign = sign;
    return {playerName, playerSign};
}

function displayPlayerData() {
    document.getElementById("p1-name").innerText = player1.playerName;
    document.getElementById("p1-sign").innerText = player1.playerSign;
    document.getElementById("p2-name").innerText = player2.playerName;
    document.getElementById("p2-sign").innerText = player2.playerSign;
}
    
function displayPlayerTurn(name, sign) {
    document.getElementById("player-name-with-turn").innerText = name;
    document.getElementById("player-sign-with-turn").innerText = sign;
}

function displayGameGrid() {
    let gameBoard = getGameBoard();
    for (let i = 0; i < 9; i++)
        ternaryCont.appendChild(gameBoard[i]);
    ternaryCont.style.display = "grid";
    preTernary.style.display = "flex";
    postTernary.style.display = "flex";
}

function getWinningPaths() {
    return [
        [0, 1, 2],
        [2, 5, 8],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [3, 4, 5],
        [0, 4, 8],
        [2, 4, 6]
    ];
}

function runGameEndingProcedure(name, mode) {
    const gameState = document.createElement("div");
    gameState.innerHTML = `<div class="player-data" id="game-state">
                           <button id="game-restart" class="answer-btn">Restart The Game</button>
                           <button id="game-reset" class="answer-btn">Reset The Game</button>
                           </div>`;
    if (name !== "")
        document.getElementById("winner-details").innerHTML = `<h3>The Winner Is ${name}</h3>`;
    else 
        document.getElementById("winner-details").innerHTML = `<h3>The Game Is A Draw</h3>`;

    postTernary.appendChild(gameState);
    document.getElementById("game-reset").addEventListener('click', () => {
        let boxArray = document.querySelectorAll('.box');
        boxArray.forEach((box) => {
            ternaryCont.removeChild(box);
        });
        document.getElementById("winner-details").innerHTML = `<div class="player-data" id="winner-details">
                <h3><span id="player-name-with-turn"></span>'s Turn Has Sign: <span id="player-sign-with-turn"></span></h3>
            </div>`;
        postTernary.removeChild(gameState);
        if (mode === "AI")
            startGameWithAI();
        else 
            startGameWithPlayer2();
    });
}

function startGameWithAI() {
    displayGameGrid();
    displayPlayerData();
    let paths = getWinningPaths();
    let filledBoxes = 0;
    let endGame = false;
    displayPlayerTurn(player1.playerName, player1.playerSign);
    let boxArray = document.querySelectorAll('.box');
    boxArray.forEach((box) => {
        box.addEventListener('mouseenter', () => {
            box.style.background = "#5f7ca9";
        });
        box.addEventListener('mouseleave', () => {
            box.style.background = "var(--primary-color)";
        });
        box.addEventListener('click', () => {
            if (!endGame) {
                if (box.innerText === "") {
                    box.innerText = player1.playerSign;
                    if (checkForWin(player1.playerSign, boxArray, paths)) {
                        runGameEndingProcedure(player1.playerName, "AI");
                        endGame = true;
                        return;
                    }
                    if (!endGame)
                        handleAIMove(boxArray, paths);
                    filledBoxes += 2;
                    if (filledBoxes > 9) {
                        runGameEndingProcedure("", "AI");
                        endGame = true;
                        return;
                    }
                }
            }
        });
    });
}
    
function startGameWithPlayer2() {
    displayGameGrid();
    displayPlayerData();
    let paths = getWinningPaths();
    displayPlayerTurn(player1.playerName, player1.playerSign);
    let boxArray = document.querySelectorAll('.box');
    let player1Turn = true, endGame = false;
    let filledBoxes = 0;
    boxArray.forEach((box) => {
        box.addEventListener('mouseenter', () => {
            box.style.background = "#5f7ca9";
        });
        box.addEventListener('mouseleave', () => {
            box.style.background = "var(--primary-color)";
        });
        box.addEventListener('click', () => {
            if (!endGame) {
                if (player1Turn && box.innerText === "") {
                    box.innerText = player1.playerSign;
                    if (checkForWin(player1.playerSign, boxArray, paths)) {
                        runGameEndingProcedure(player1.playerName);
                        endGame = true;
                        return;
                    }
                    displayPlayerTurn(player2.playerName, player2.playerSign);
                    player1Turn = false;
                    filledBoxes++;
                }
                else if (!player1Turn && box.innerText === "") {
                    box.innerText = player2.playerSign;
                    if (checkForWin(player2.playerSign, boxArray, paths)) {
                        runGameEndingProcedure(player2.playerName, "pvp");
                        endGame = true;
                        return;
                    }
                    displayPlayerTurn(player1.playerName, player1.playerSign, "pvp");
                    player1Turn = true;
                    filledBoxes++;
                }
                if (filledBoxes === 9) {
                    runGameEndingProcedure("", "pvp");
                    endGame = true;
                    return;
                }
            }
        });
    });
}

function handleAIMove(boxArray, paths) {
    let notFilledIndex;
    for (let path of paths) {
        let boxesFilled = 0;
        for (let index of path) {
            if (boxArray[index].innerText === player1.playerSign) {
                boxesFilled++;
            } 
            else if (boxArray[index].innerText === "") {
                notFilledIndex = index;
            }
        }
        if (boxesFilled === 2 && notFilledIndex !== undefined) {
            boxArray[notFilledIndex].innerText = player2.playerSign;
            if (checkForWin(player2.playerSign, boxArray, paths)) {
                runGameEndingProcedure(player2.playerName);
            }
            return;
        }
    }
    for (let box of boxArray) { // if no two boxes are filled in a row or diagonal, the pick the first empty box
        if (box.innerText === "") {
            box.innerText = player2.playerSign;
            if (checkForWin(player2.playerSign, boxArray, paths)) {
                runGameEndingProcedure(player2.playerName);
            }
            break;
        }
    }
}

function checkForWin(playerSign, boxArray, paths) {
    for (let path of paths) {
        if (boxArray[path[0]].innerText === playerSign &&
            boxArray[path[1]].innerText === playerSign &&
            boxArray[path[2]].innerText === playerSign)
            return true;
    }
    return false;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (twoPlayerEnabled && player1Sign.value.toUpperCase() === player2Sign.value.toUpperCase()) {
        player2Sign.style.border = "2px solid yellow";
        warning.style.display = "block";
        return;
    }
    secondaryCont.style.display = "none";
    player1 = createPlayer(player1Name.value.toUpperCase(), player1Sign.value.toUpperCase());
    player2 = createPlayer(player2Name.value.toUpperCase(), player2Sign.value.toUpperCase());
    if (!twoPlayerEnabled) {
        player2.playerName = "Open AI";
        if (player1.playerSign === 'O')
            player2.playerSign = 'X';
        else
            player2.playerSign = 'O';
        startGameWithAI();
    }
    else {
        startGameWithPlayer2();
    }
});