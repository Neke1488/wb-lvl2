const desk = document.querySelector(".place");
const gameModeChoose = document.getElementsByName("gameModeChoose");
const difficultChoose = document.getElementsByName("modeDifficult");
const newGameButton = document.querySelector(".newGameButton");
let cells = [];
let firstWay = "X";
let secondWay = "O";
let step = firstWay;
const chooseMode = {
  hard: 'hard',
  easy: 'easy'
};
const chooseType = {
  players: 'player',
  bot: 'bot'
}
let mode;
let typeGame;
let gameOver = false;


document.querySelector(".easyModeDifficult").onclick = () => {
  mode = chooseMode.easy;
}

document.querySelector(".hardModeDifficult").onclick = () => {
  mode = chooseMode.hard;
}



document.querySelector(".playerBot").onclick = function gameModeBot() {
  typeGame = chooseType.bot;
  if (this.checked) {
    cells = [];
    const gameData = localStorage.getItem('gameData');
    console.log('123123213123123', gameData);
    if (gameData?.cells) {
      loadGame();
      console.log('123123', cells);
      cells = cells.map((cellContent) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = cellContent;
        desk.appendChild(cell);

        cell.addEventListener("click", () => {
          if (cell.textContent === "" && step === firstWay && !gameOver) {
            cell.textContent = step;
            cell.style.cursor = "not-allowed";

            if (checkWin(step)) {
              alert(step + "победил!");
              gameOver = true;
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
            } else {
              step = secondWay;
              setTimeout(() => botMove(mode), 200);
            }
          }
        });
      })
    } else {
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        desk.appendChild(cell);

        cell.addEventListener("click", () => {
          if (cell.textContent === "" && step === firstWay && !gameOver) {
            cell.textContent = step;
            cell.style.cursor = "not-allowed";

            if (checkWin(step)) {
              alert(step + "победил!");
              gameOver = true;
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
            } else {
              step = secondWay;
              setTimeout(() => botMove(mode), 200);
            }
          }
        });
      }
    }

    function botMove(mode) {
      if (mode === chooseMode.easy) {
        const emptyCells = cells.filter((cell) => cell.textContent === "");
        if (emptyCells.length > 0 && step === secondWay) {
          const randomIndex = Math.floor(Math.random() * emptyCells.length);
          const botCell = emptyCells[randomIndex];
          botCell.textContent = step;
          botCell.style.cursor = "not-allowed";

          if (checkWin(step)) {
            alert(step + "победил!");
            gameOver = true;
          } else if (checkDraw()) {
            alert("Ничья!");
            gameOver = true;
          } else {
            step = firstWay;
            saveGame();
          }
        }
      } else if (mode === chooseMode.hard) {
        if (step === secondWay) {
          if (cells[4].textContent === '') {
            cells[4].textContent = secondWay;
          } else {
            const corners = [0, 2, 6, 8];
            const cornersEmpty = corners.filter((index) => cells[index].textContent === '');

            if (cornersEmpty.length > 0) {
              const standCorner = cornersEmpty[Math.floor(Math.random() * cornersEmpty.length)];
              cells[standCorner].textContent = secondWay;
            } else {
              const randomCells = [...cells].filter((cell) => cell.textContent === '');
              if (randomCells.length > 0) {
                const randomIndexCells = Math.floor(Math.random() * randomCells.length);
                console.log('secondway', randomCells[randomIndexCells]);
                randomCells[randomIndexCells].textContent = secondWay;
              }
            }

          }
          // for(let i = 0; i < cells.length; i++) {
          //     botCell = cells[i];
          //     botCell.textContent = secondWay;
          // }
          if (checkWin(secondWay)) {
            alert(secondWay + "победил!");
            gameOver = true;
          } else if (checkDraw()) {
            alert("Ничья!");
            gameOver = true;
          } else {
            step = firstWay;
            saveGame();
          }
        }
      }
    }
  }
};


document.querySelector(".playerPlayer").onclick = function gameModePlayer() {
  typeGame = chooseType.players;
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
            saveGame();
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
            saveGame();
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

function saveGame() {
  if (gameOver) {
    localStorage.removeItem('gameData');
    return;
  }
  const gameData = {
    settings: {
      mode: typeGame,
      difficult: mode,
    },
    cells: cells.map((cell) => cell.textContent),
  };

  localStorage.setItem('gameData', JSON.stringify(gameData))
}

function loadGame() {
  const gameDataJSON = localStorage.getItem('gameData');
  if (!gameDataJSON) {
    return
  }
  const gameData = JSON.parse(gameDataJSON);
  for (const modeButtons of gameModeChoose) {
    modeButtons.checked = modeButtons.value === gameData.settings.mode;
  }
  if (gameData.settings.difficult === chooseMode) {
    for (const difficultButtons of difficultChoose) {
      difficultButtons.checked = difficultButtons.value === gameData.settings.difficult;
    }
  }
  cells = gameData.cells;
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
    return combinations.every((index) => cells[index].textContent === player);
  });
}

function checkDraw() {
  return cells.every((cell) => cell.textContent !== "");
}

