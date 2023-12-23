const desk = document.querySelector('.place');
const cells = [];
let firstWay = "X";
let secondWay = "O";
let gameOver = false;



document.querySelector('.playerBot').onclick = function gameModeBot() {
if (this.checked) {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        desk.appendChild(cell);

        cell.addEventListener("click", () => {
        if (cell.textContent === "" && firstWay === "X" && !gameOver) {
            cell.textContent = firstWay;
            cell.style.cursor = "not-allowed";

            if (checkWin(firstWay)) {
                alert(firstWay + "победил!");
                gameOver = true;
            } else if (checkDraw()) {
                alert("Ничья!");
                gameOver = true;
            } else {
                firstWay = "O";
                setTimeout(botMove, 200);
            }
        }
    })
}


function botMove() {
    const emptyCells = cells.filter((cell) => cell.textContent === "");

    if (emptyCells.length > 0 && firstWay === "O") {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const botCell = emptyCells[randomIndex];
        botCell.textContent = firstWay;
        botCell.style.cursor = "not-allowed";

        if (checkWin(firstWay)) {
            alert(firstWay + "победил!");
            gameOver = true;
        } else if (checkDraw()) {
            alert("Ничья!");
            gameOver = true;
        } else {
            firstWay = "X";
        }
    }
}
}
}

document.querySelector('.playerPlayer').onclick = function gameModePlayer() {
    if (this.checked) {

        }

    }



function checkWin(player) {
    const winResult = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    return winResult.some((combinations) => {
        return combinations.every((index) => cells[index].textContent === player)
    });
}

function checkDraw() {
    return cells.every((cell) => cell.textContent !== ""); 
}




