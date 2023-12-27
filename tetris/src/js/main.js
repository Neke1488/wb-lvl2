const canvas = document.getElementById("desk");
const view = canvas.getContext("2d");
view.canvas.width = columns * block_size;
view.canvas.height = height * block_size;
view.scale(block_size, block_size);
//логика перемещения заключается в том, что мы определяем нынешние координаты фигуры,
//с помощью spread оператора переносим их в объект, а дальше меняем значение координаты на 1
//чтобы фигура в будущем опускалась вниз или перемещалась в стороны
const control = {
  [keys.down]: (place) => ({ ...place, y: place.y + 1 }),
  [keys.left]: (place) => ({ ...place, x: place.x - 1 }),
  [keys.right]: (place) => ({ ...place, x: place.x + 1 }),
  [keys.space]: (place) => ({ ...place, y: place.y + 1 }),
  [keys.up]: (place) => desk.rotate(place),
};
//время падения фигуры вниз
const time = { start: 0, elapsed: 0, level: 1000 };
let storageScore = { score: 0 };
let gameOverInfo;
const nextElem = document.getElementById("next");
const viewNextElem = nextElem.getContext("2d");
viewNextElem.canvas.width = 4 * block_size;
viewNextElem.canvas.height = 4 * block_size;
viewNextElem.scale(block_size, block_size);
let desk = new Desk(view, viewNextElem);
//начало игры
function start() {
  desk.restart();
  let block = new Block(view);
  desk.block = block;
  desk.block.firstPosition();
  animate();
}
//функция перерисовки для каждого цикла
function animate(now = 0) {
  time.elapsed = now - time.start;
  if (time.elapsed > time.level) {
    time.start = now;

    if (!desk.drop()) {
      gameOver();
      return;
    }
  }
  view.clearRect(0, 0, view.canvas.width, view.canvas.height);

  desk.draw();
  gameOverInfo = requestAnimationFrame(animate);
}
//функция обновления рекорда
function updateScore(key, value) {
  let elem = document.querySelector(".scoreNumber");
  if (elem) {
    elem.textContent = value;
  }
}
//функция завершения игры
function gameOver() {
  cancelAnimationFrame(gameOverInfo);
  view.fillStyle = "black";
  view.fillRect(1, 3, 8, 1.2);
  view.font = "italic small-caps bold 1px arial";
  view.fillStyle = "red";
  view.fillText("GAME OVER", 1.8, 4);
}
//с помощью прокси обновляем данные на экране при каждом изменении счета
let updateScoreInfo = new Proxy(storageScore, {
  set: (target, key, value) => {
    target[key] = value;
    updateScore(key, value);
    return true;
  },
});

document.addEventListener("keydown", (event) => {
  if (control[event.keyCode]) {
    //отменяем действие экрана по умолчанию
    event.preventDefault();
//получаем новые координаты фигуры
    let place = control[event.keyCode](desk.block);
    if (event.keyCode === keys.space) {
      while (desk.check(place)) {
        updateScoreInfo.score += points.fastFall;
        desk.block.coordinates(place);
        place = control[keys.down](desk.block);
      }
      //проверяем положение фигуры
    } else if (desk.check(place)) {
      desk.block.coordinates(place);
      if (event.keyCode === keys.down) {
        updateScoreInfo.score += points.simpleFall;
      }
    }
  }
});
