const desk = document.querySelector(".place");
const newGameButton = document.querySelector(".newGameButton");
const cells = [];
let firstWay = "X";
let secondWay = "O";
let step = firstWay;
const chooseMode = {
    hard: 'hard',
    easy: 'easy'
};
let mode;
let gameOver = false;

document.querySelector(".easyModeDifficult").onclick = () => {
    mode = chooseMode.easy;
}

document.querySelector(".hardModeDifficult").onclick = () => {
    mode = chooseMode.hard;
    console.log('213', mode);
}


document.querySelector(".playerBot").onclick = function gameModeBot() {
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
            setTimeout(() => botMove(mode), 200);
          }
        }
      });
    }

    function botMove(mode) {
      const emptyCells = cells.filter((cell) => cell.textContent === "");
    if (mode === chooseMode.easy) {
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
    } else if (mode === chooseMode.hard) {
        console.log('1123', mode);
        for(let i = 0; i < emptyCells.length; i++) {
            botCell = emptyCells[i];
            botCell.textContent = secondWay;
            if(cells[i]){
                continue;
            }
            cells[i] = firstWay;
            if (!cells[4]) {
                botCell = cells[4];
            }
        }
    }
    }
  }
};


document.querySelector(".playerPlayer").onclick = function gameModePlayer() {
  if (this.checked) {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        desk.appendChild(cell);
        cell.addEventListener("click", () => {
          if (cell.textContent === "" && step === firstWay && !gameOver) {
            cell.textContent = firstWay;
            cell.style.cursor = "not-allowed";

            if (checkWin(firstWay)) {
              alert(firstWay + "победил!");
              gameOver = true;
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
            } else {
              step = secondWay;
            //localstorage.setItem(cells, cells);
            }
          } else if (cell.textContent === "" && step === secondWay && !gameOver) {
            cell.textContent = secondWay;
            cell.style.cursor = "not-allowed";
  
            if (checkWin(secondWay)) {
              alert(secondWay + "победил!");
              gameOver = true;
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
            } else {
              step = firstWay;
            }
          }
        });
      }
  }
};

// function newGame() {
//   cells.forEach((cell) => {
//     cell.сlassName = "";
//     cells.unshift(cell);
//     desk.remove(cell);
//   });
//   firstWay = "X";
//   gameOver = false;
// }


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
    return combinations.every((index) => cells[index].textContent === player);
  });
}

function checkDraw() {
  return cells.every((cell) => cell.textContent !== "");
}

