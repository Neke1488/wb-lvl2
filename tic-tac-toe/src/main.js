const desk = document.querySelector(".place");
const gameModeChoose = document.getElementsByName("gameModeChoose");
const difficultChoose = document.getElementsByName("modeDifficult");
const newGameButton = document.querySelector(".newGameButton");
let cells = [];
let firstWay = "X";
let secondWay = "O";
let step = firstWay;
const chooseMode = {
  hard: "hard",
  easy: "easy",
};
const chooseType = {
  players: "player",
  bot: "bot",
};
let mode;
let typeGame;
let gameOver = false;

//вешаем onclick для того, чтобы отслеживать нажатие на radio button для состояния выбора уровня сложности
document.querySelector(".easyModeDifficult").onclick = () => {
  mode = chooseMode.easy;
};

document.querySelector(".hardModeDifficult").onclick = () => {
  mode = chooseMode.hard;
};

//вешаем onclick при выборе режима игры с ботом
document.querySelector(".playerBot").onclick = function gameModeBot() {
  //передаем для дальнейшей работы с localStorage тип игры в виде объекта
  typeGame = chooseType.bot;
  //проверяем состояние нажатого radio button
  if (this.checked) {
    cells = [];
    desk.innerHTML = null;
    const gameData = localStorage.getItem("gameData");
    if (gameData) {
      //если игра имеет какие либо данные в localStorage, то подгружаем их и рисуем поле на моменте последнего завершения
      loadGame();
      console.log("123123", cells);
      cells = cells.map((cellContent) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = cellContent;
        desk.appendChild(cell);
        //вешаем слушатель на клик при нажатие на пустое поле, для хода
        cell.addEventListener("click", () => {
          if (cell.textContent === "" && step === firstWay && !gameOver) {
            cell.textContent = step;
            cell.style.cursor = "not-allowed";
            //проверяем этапы развития событий для победы, либо ничьи, либо хода бота
            if (checkWin(step)) {
              alert(step + "победил!");
              gameOver = true;
              newGame();
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
              newGame();
            } else {
              step = secondWay;
              setTimeout(() => botMove(mode), 200);
            }
          }
        });
        return cell;
      });
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
              newGame();
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
              newGame();
            } else {
              step = secondWay;
              setTimeout(() => botMove(mode), 200);
            }
          }
        });
      }
    }
    //функция для хода бота
    function botMove(mode) {
      //вначале проверяем какой режим игры выбран
      if (mode === chooseMode.easy) {
        //фильтруем пустые клетки
        const emptyCells = cells.filter((cell) => cell.textContent === "");
        //передаем ход боту если соблюдается условие
        if (emptyCells.length > 0 && step === secondWay) {
          //так как режим игры легкий, то достаточно просто того, чтобы бот ходил в рандомную свободную клетку
          const randomIndex = Math.floor(Math.random() * emptyCells.length);
          const botCell = emptyCells[randomIndex];
          botCell.textContent = step;
          botCell.style.cursor = "not-allowed";

          if (checkWin(step)) {
            alert(step + "победил!");
            gameOver = true;
            newGame();
          } else if (checkDraw()) {
            alert("Ничья!");
            gameOver = true;
            newGame();
          } else {
            step = firstWay;
            saveGame();
          }
        }
        //для сложного режима игры применил тактику при игре за 0, о которой вычитал в интернете, где сначала игрок, который ходит вторым
        //проверяет свободна ли середина, а потом ставится по углам и если все занято переходит на рандомные свободные клетки
      } else if (mode === chooseMode.hard) {
        if (step === secondWay) {
          if (cells[4].textContent === "") {
            cells[4].textContent = secondWay;
          } else {
            const corners = [0, 2, 6, 8];
            const cornersEmpty = corners.filter(
              (index) => cells[index].textContent === ""
            );

            if (cornersEmpty.length > 0) {
              const standCorner =
                cornersEmpty[Math.floor(Math.random() * cornersEmpty.length)];
              cells[standCorner].textContent = secondWay;
            } else {
              const randomCells = [...cells].filter(
                (cell) => cell.textContent === ""
              );
              if (randomCells.length > 0) {
                const randomIndexCells = Math.floor(
                  Math.random() * randomCells.length
                );
                randomCells[randomIndexCells].textContent = secondWay;
              }
            }
          }
          if (checkWin(secondWay)) {
            alert(secondWay + "победил!");
            gameOver = true;
            newGame();
          } else if (checkDraw()) {
            alert("Ничья!");
            gameOver = true;
            newGame();
          } else {
            step = firstWay;
            saveGame();
          }
        }
      }
    }
  }
};

//функция для игры с другим игроком
document.querySelector(".playerPlayer").onclick = function gameModePlayer() {
  typeGame = chooseType.players;
  if (this.checked) {
    cells = [];
    desk.innerHTML = null;
    const gameDataPlayer = localStorage.getItem("gameData");
    if (gameDataPlayer) {
      loadGame();
      cells = cells.map((cellContent) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.textContent = cellContent;
        desk.appendChild(cell);

        cell.addEventListener("click", () => {
          if (cell.textContent === "" && step === firstWay && !gameOver) {
            console.log("1231dfdsf23", step);
            cell.textContent = step;
            cell.style.cursor = "not-allowed";

            if (checkWin(step)) {
              alert(step + "победил!");
              gameOver = true;
              newGame();
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
              newGame();
            } else {
              step = secondWay;
              saveGame();
            }
          } else if (
            cell.textContent === "" &&
            step === secondWay &&
            !gameOver
          ) {
            cell.textContent = step;
            cell.style.cursor = "not-allowed";

            if (checkWin(step)) {
              alert(step + "победил!");
              gameOver = true;
              newGame();
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
              newGame();
            } else {
              step = firstWay;
              saveGame();
            }
          }
        });
        return cell;
      });
    } else {
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell);
        desk.appendChild(cell);

        cell.addEventListener("click", () => {
          if (cell.textContent === "" && step === firstWay && !gameOver) {
            console.log("1231dfdsf23", step);
            cell.textContent = step;
            cell.style.cursor = "not-allowed";

            if (checkWin(step)) {
              alert(step + "победил!");
              gameOver = true;
              newGame();
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
              newGame();
            } else {
              step = secondWay;
              saveGame();
            }
          } else if (
            cell.textContent === "" &&
            step === secondWay &&
            !gameOver
          ) {
            cell.textContent = step;
            cell.style.cursor = "not-allowed";

            if (checkWin(step)) {
              alert(step + "победил!");
              gameOver = true;
              newGame();
            } else if (checkDraw()) {
              alert("Ничья!");
              gameOver = true;
              newGame();
            } else {
              step = firstWay;
              saveGame();
            }
          }
        });
      }
    }
  }
};
//функция для начала новой игры
function newGame() {
  localStorage.removeItem("gameData");
  cells.forEach((cell) => {
    cell.textContent = "";
  });
  step = firstWay;
  gameOver = false;
}
//функция сохранения новой игры
function saveGame() {
  if (gameOver) {
    localStorage.removeItem("gameData");
    return;
  }
  const gameData = {
    settings: {
      mode: typeGame,
      difficult: mode,
    },
    cells: cells.map((cell) => cell.textContent),
  };

  localStorage.setItem("gameData", JSON.stringify(gameData));
}
//функция загрузки новой игры из localStorage
function loadGame() {
  const gameDataJSON = localStorage.getItem("gameData");
  if (!gameDataJSON) {
    return;
  }
  const gameData = JSON.parse(gameDataJSON);
  for (const modeButtons of gameModeChoose) {
    modeButtons.checked = modeButtons.value === gameData.settings.mode;
  }
  if (gameData.settings.difficult === chooseMode) {
    for (const difficultButtons of difficultChoose) {
      difficultButtons.checked =
        difficultButtons.value === gameData.settings.difficult;
    }
  }
  cells = gameData.cells;
}

//функция проверки на победителя по указанным комбинациям
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
//проверка клетки на пустоту
function checkDraw() {
  return cells.every((cell) => cell.textContent !== "");
}

newGameButton.addEventListener("click", newGame);
