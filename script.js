const date = document.getElementById("date");
date.innerText = new Date().getFullYear();
const header = document.querySelector("header");
const main = document.querySelector("main");
const footer = document.querySelector("footer");
const mainHeight = header.offsetHeight + footer.offsetHeight;
main.style.cssText = `min-height: calc(100vh - ${mainHeight}px); flex-direction: "column";`;
const primaryCont = document.getElementById("primary-container");
const secondaryCont = document.getElementById("secondary-container");
const ternaryCont = document.getElementById("ternary-container");
const humanBtn = document.getElementById("human-btn");
const aiBtn = document.getElementById("ai-btn");
const twoPlayersForm = document.getElementById("two-player");
const startGameBtn = document.getElementById("start-game-btn");
const player1Name = document.getElementById("name1");
const player1Sign = document.getElementById("sign1");
const player2Name = document.getElementById("name2");
const player2Sign = document.getElementById("sign2");
const warning = document.getElementById("warning");
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

function startGameWithAI(player) {
    let gameBoard = getGameBoard();
    for (let i = 0; i < 9; i++) {
        ternaryCont.appendChild(gameBoard[i]);
        ternaryCont.style.display = "grid";
    }
}

function startGameWithPlayer2(playerOne, playerTwo) {

}

startGameBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!twoPlayerEnabled) {
        player2Name.removeAttribute("required");
        player2Sign.removeAttribute("required");
    }
    if (player1Sign.value.toUpperCase() === player2Sign.value.toUpperCase()) {
        player2Sign.style.border = "2px solid yellow";
        warning.style.display = "block";
        return;
    }
    secondaryCont.style.display = "none";
    player1 = createPlayer(player1Name.value.toUpperCase(), player1Sign.value.toUpperCase());
    player2 = createPlayer(player2Name.value.toUpperCase(), player2Sign.value.toUpperCase());
    if (!twoPlayerEnabled) {
        startGameWithAI(player1);
    }
    else {
        startGameWithPlayer2(player1, player2);
    }
});