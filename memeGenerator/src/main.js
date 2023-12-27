const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const addFile = document.querySelector(".addImage");
const chooseColor = document.querySelector(".chooseColor");
const chooseSize = document.querySelector(".chooseSize");
const chooseText = document.querySelector(".chooseText");
const addText = document.querySelector(".btnAdd");
const saveImageDesktop = document.querySelector(".btnSave");
const text = [];
let image = new Image();

//функция сохранения изображения на компьютере
saveImageDesktop.addEventListener("click", () => {
  const download = document.createElement("a");
  download.href = canvas.toDataURL("image/png");
  download.download = "newImage.png";
  download.click();
});
//функция размещения текста на фото
function textOnPhoto() {
  text.forEach((textElem) => {
    ctx.font = textElem.font;
    ctx.fillStyle = textElem.color;
    ctx.fillText(textElem.content, textElem.x, textElem.y);
  });
}

//функция для отображения изображения
function showPicture() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, image.width, image.height);

  textOnPhoto();
}

//вешаем слушатель по клику на кнопку добавления текста на фото
addText.addEventListener("click", () => {
  if (image.onload) {
    //свойства текста
    const textContent = chooseText.value;
    const color = chooseColor.value;
    const font = `${chooseSize.value}px Times New Roman`;

    const textElem = {
      content: textContent,
      font: font,
      color: color,
      x: 20,
      y: 90,
    };
    text.push(textElem);
    textOnPhoto();

    //функция перемещения текста на фото
    canvas.addEventListener("mousedown", (event) => {
      //при нажатой кнопке мыши фиксируем положение откуда берем
      const positionX = event.clientX - canvas.getBoundingClientRect().left;
      const posititonY = event.clientY - canvas.getBoundingClientRect().top;
      text.forEach((textElem) => {
        const widthElement = ctx.measureText(textElem.content).width;
        const heightElement = parseInt(textElem.font);
        if (
          positionX >= textElem.x &&
          positionX <= textElem.x + widthElement &&
          posititonY >= textElem.y - heightElement &&
          posititonY <= textElem.y
        ) {
          let removePosition = false;
          //далее вешаем обработчик на перемешение текста с нажатой кнопкой
          canvas.addEventListener("mousemove", (event) => {
            if (removePosition) {
              const newPositionX =
                event.clientX - canvas.getBoundingClientRect().left;
              const newPositionY =
                event.clientY - canvas.getBoundingClientRect().top;

              textElem.x = newPositionX - widthElement / 2;
              textElem.y = newPositionY + heightElement / 2;

              showPicture();
            }
          });
          //момент отпускания кнопки мыши ставим новое положение
          canvas.addEventListener("mouseup", function () {
            removePosition = false;
          });
          removePosition = true;
        }
      });
    });
  }
});
//функция загрузки изображения в canvas элемент
addFile.addEventListener("change", (event) => {
  const f = event.target.files[0];
  if (f) {
    image.src = URL.createObjectURL(f);
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);
      textOnPhoto();
    };
  }
});
