//класс для игрового поля
class Desk {
  constructor(view, viewNextElem) {
    this.view = view;
    this.viewNextElem = viewNextElem;
    this.block = null;
    this.next = null;
  }
  // появляние блока на доске
  restart() {
    this.row = this.emptyDesk();
    this.block = new Block(this.view);
    this.block.firstPosition();
    this.showNewBlock();
  }
  // отображение нового блока на поле
  showNewBlock() {
    this.next = new Block(this.viewNextElem);
    this.viewNextElem.clearRect(
      0,
      0,
      viewNextElem.canvas.width,
      viewNextElem.canvas.height
    );
    this.next.draw();
  }
  // создание матрицы нужного размера, которая заполнена нулями
  emptyDesk() {
    return Array.from({ length: height }, () => Array(columns).fill(0));
  }
  //проверка расположения эдемента(есть ли другой блок, стены, низ карты)
  check(place) {
    return place.figure.every((grid, dy) => {
      return grid.every((value, dx) => {
        let x = place.x + dx;
        let y = place.y + dy;
        return (
          value === 0 ||
          (this.walls(x) && this.floor(y) && this.figuresHere(x, y))
        );
      });
    });
  }
  //проверка на столкновение со стеной
  walls(x) {
    return x >= 0 && x < columns;
  }
  //проверка на столкновение с полом
  floor(y) {
    return y <= height;
  }
  //проверка на столкновение с фигурой
  figuresHere(x, y) {
    return this.row[y] && this.row[y][x] === 0;
  }
  //повороты блоков
  rotate(block) {
    //клонирование матрицы
    let place = JSON.parse(JSON.stringify(block));

    for (let y = 0; y < place.figure.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [place.figure[x][y], place.figure[y][x]] = [
          place.figure[y][x],
          place.figure[x][y],
        ];
      }
    }

    place.figure.forEach((grid) => grid.reverse());

    return place;
  }
  //отрисовка блока на поле
  draw() {
    this.block.draw();
    this.drawDesk();
  }

  drawDesk() {
    this.row.forEach((grid, y) => {
      grid.forEach((value, x) => {
        if (value > 0) {
          this.view.fillStyle = colors[value];
          this.view.fillRect(x, y, 1, 1);
        }
      });
    });
  }
  //падение блока
  drop() {
    let place = control[keys.down](this.block);
    if (this.check(place)) {
      this.block.coordinates(place);
    } else {
      this.stopState();
      this.deletePoles();
      if (this.block.y === 0) {
        return false;
      }
      this.block = this.next;
      this.block.view = this.view;
      this.block.firstPosition();
      this.showNewBlock();
    }
    return true;
  }
  //заморозка фигуры при достижении пола
  stopState() {
    this.block.figure.forEach((grid, y) => {
      grid.forEach((value, x) => {
        if (value > 0) {
          this.row[y + this.block.y][x + this.block.x] = value;
        }
      });
    });
  }
  //очки за очистку собранных рядов
  getDeletePoles(poles) {
    return poles === 1
      ? points.one
      : poles === 2
      ? points.double
      : poles === 3
      ? points.triple
      : poles === 4
      ? points.tetris
      : 0;
  }
//очистка собранных рядов блоков
  deletePoles() {
    let poles = 0;
    this.row.forEach((grid, y) => {
      if (grid.every((value) => value > 0)) {
        poles++;
        this.row.splice(y, 1);

        this.row.unshift(Array(columns).fill(0));
      }
    });
    if (poles > 0) {
      updateScoreInfo.score += this.getDeletePoles(poles);
    }
  }
}
