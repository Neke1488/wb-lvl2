//создадим класс для выпадающих блоков
class Block {
  constructor(view) {
    this.view = view;
    this.respawn();
  }

  respawn() {
    this.numberOfTetramino = this.randomChoose(colors.length - 1);
    //для корректного отображения элемента будем использовать массив, где
    //закрашиваться будут те поля, которые имеют значение больше 0, тем самым элемент будет видоизменяться
    //все массивы будут в представлении 3х3, только I будет 4х4
    this.figure = figures[this.numberOfTetramino];
    this.color = colors[this.numberOfTetramino];
    //первоначальное расположение элемента
    this.x = 0;
    this.y = 0;
  }
  //блок в центр поля
  firstPosition() {
    this.x = this.numberOfTetramino === 4 ? 4 : 3;
  }

  //функция отрисовки элемента
  draw() {
    //свойство fillStyle позволяет обращаться к стилям элемента canvas
    this.view.fillStyle = this.color;
    //с помощью перебора массива будем отрисовывать элементы
    this.figure.forEach((grid, y) => {
      grid.forEach((value, x) => {
        if (value > 0) {
          //если значение у массива фигуры больше одного, то с помощью метода
          //fillRect служит для отрисовки элемента canvas куда мы передаем координаты ячейки на доске
          this.view.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }
  //расположение элемента
  coordinates(place) {
    this.x = place.x;
    this.y = place.y;
    this.figure = place.figure;
  }

  //функция для генерации рандомного блока при появлении
  randomChoose(tetramNum) {
    return Math.floor(Math.random() * tetramNum);
  }
}
