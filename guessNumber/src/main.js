//объявляем переменные из html
const readyButton = document.querySelector(".setRange");
const guessNumber = document.querySelector(".guess");
const result = document.querySelector(".winOrNo");
const hint = document.querySelector(".hint");
const checkBtn = document.querySelector(".myAnswer");
const tryNumber = document.querySelector(".numberTry");
const restart = document.querySelector(".newGame");
//из инпутов берем значения чисел
let minRangeValue = parseInt(document.querySelector(".minRange").value);
let maxRangeValue = parseInt(document.querySelector(".maxRange").value);
//объявляем количество попыток
let tries = 0;

//функция для загаданного числа
function randomNumber(minValue, maxValue) {
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

//установка диапазона
function setRange() {
  minRangeValue = parseInt(document.querySelector(".minRange").value);
  maxRangeValue = parseInt(document.querySelector(".maxRange").value);
  randNum = randomNumber(minRangeValue, maxRangeValue);
  tryNumber.textContent = tries;
  result.textContent = "";
  hint.textContent = "";
  guessNumber.value = "";
}
//подключаем слушатель для кнопки установки диапазона введеного из инпутов
readyButton.addEventListener("click", setRange);

//подключаем слушатель для кнопки подбора правильного ответа
checkBtn.addEventListener("click", () => {
  //из инпута куда вводится значение для ответа берем значение целого числа
  const guessTry = parseInt(guessNumber.value);
  //если это значение не попало в диапазон, то выводим ошибку в поле ответа
  if (
    guessTry < minRangeValue ||
    guessTry > maxRangeValue ||
    guessTry === null
  ) {
    result.textContent = "Требуется ввести число из диапазона";
    //в ином случае выдаем ответ и увеличиваем количество попыток
  } else {
    tries++;
    tryNumber.textContent = tries;
    if (guessTry === randNum) {
      result.textContent = `Загаданное число ${randNum}`;
    } else {
      if (guessTry < randNum) {
        result.textContent = "Неверно, число больше";
      } else {
        result.textContent = "Неверно, число меньше";
      }
      //елси по условию количество попыток 3 и более начинаем выводить подсказки
      if (tries % 3 === 0) {
        hint.textContent = `Подсказка! Число ${
          randNum % 2 === 0 ? "чётное" : "нечётное"
        }`;
      }
    }
  }
});

//подключаем слушатель на кнопку начала новой игры, где обнуляем все выше объявленные значения
restart.addEventListener("click", () => {
  randNum = randomNumber(minRangeValue, maxRangeValue);
  tries = 0;
  tryNumber.textContent = tries;
  result.textContent = "";
  hint.textContent = "";
  guessNumber.value = "";
});
