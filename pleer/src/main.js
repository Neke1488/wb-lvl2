import WaveSurfer from "https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.js";

const playBtn = document.querySelector(".playBtn");
const playBtnIcon = document.querySelector(".playBtnIcon");
const waveform = document.querySelector(".waveform");
const volumeIcon = document.querySelector(".vlmIcon");
const playlist = document.querySelector(".playlistList");
const playListSongs = document.querySelector(".songs").content.querySelector(".addSongs");
const nameArtistAndSong = document.querySelector(".title");
const audioFile = document.querySelector(".songFromPlayer");
const slider = document.querySelector(".slider");
const time = document.querySelector(".time");
const totalRange = document.querySelector(".totalRange");
const songName = [
  "bamba",
  "Lil Tjay feat. Fivio Foreign, Pop Smoke-Zoo York",
  "Playboi Carti-Pop Bottles",
  "Russ Millions-6 30",
  "YoungBoy Never Broke Again - 7 Days",
];
let indexSong;

//функция получения плейлиста
if (localStorage.getItem("currentSong")) {
  indexSong = JSON.parse(localStorage.getItem("currentSong"));
} else {
  indexSong = songName;
}

//создаем wavesurfer элемента
const wavesurfer = WaveSurfer.create({
  container: waveform,
  height: 100,
  waveColor: "#4F4A85",
  progressColor: "#383351",
});

//с помощью методов из свежей документации wavesurfer создаем функцию включения песни по кнопке play
function turnPlay() {
  wavesurfer.playPause();

  const musicPlay = wavesurfer.isPlaying();

  if (musicPlay) {
    playBtnIcon.src = "./assets/icons/pause.svg";
  } else {
    playBtnIcon.src = "./assets/icons/play.svg";
  }
}

//функция изменения громокости
function checkVolume(e) {
  const volume = e.target.value / 100;
  wavesurfer.setVolume(volume);
  localStorage.setItem("playerVolume", volume);
}
//значения громкости берем из localStorage с определенным условием отображения звука
function takeVolumeFromLocalStorage() {
  const volume = localStorage.getItem("playerVolume") * 100 || 50;
  slider.value = volume;
}

//функция отображения тайм-кода трека
function timeView(seconds) {
  return new Date(seconds * 1000).toISOString().substr(11, 8);
}

//функция замьючивания трека по кнопке
function mute() {
  if (wavesurfer.getMuted() == false) {
    wavesurfer.setMuted(true);
    volumeIcon.src = "./assets/icons/mute.svg";
    slider.disabled = true;
  } else {
    wavesurfer.setMuted(false);
    slider.disabled = false;
    volumeIcon.src = "./assets/icons/volume.svg";
  }
}

//функция для отображения плейлиста
function showPlaylist(list) {
  list.forEach((item) => {
    const playlistSongsPlace = playListSongs.cloneNode(true);
    playlistSongsPlace.querySelector(".nameForSong").textContent = item;
    playlist.append(playlistSongsPlace);
  });
}

showPlaylist(songName);

//функция для выбора трека
function chooseSong(event) {
  if (event.target.classList.contains("nameForSong")) {
    const currentSongName = event.target
      .closest(".addSongs")
      .querySelector(".nameForSong").textContent;
    indexSong = songName.indexOf(currentSongName);
    showSongs(songName[indexSong]);
  }
}

//функция для отображения песни и названия в поле плеера
function showSongs(songName) {
  nameArtistAndSong.innerHTML = songName;
  audioFile.src = `./assets/audio/${songName}.mp3`;
  wavesurfer.load(`./assets/audio/${songName}.mp3`);
}
//вешаем обработчик на песни
playlist.addEventListener("click", chooseSong);
//функция хранения плейлиста в localStorage
function saveLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

saveLocalStorage("currentSong", indexSong);
//при загрзуке всей странице вызываем настройку громкости для треков плеера
window.addEventListener("load", takeVolumeFromLocalStorage);
showSongs(songName[indexSong]);
//включение песни по кнопки
playBtn.addEventListener("click", turnPlay);
//изменение иконки на mute при клике замьючивания трека
volumeIcon.addEventListener("click", mute);
//слайдер ддля изменения громкости
slider.addEventListener("input", checkVolume);
//с помощью wavesurfer on ready устанавливаем при загрузке окна элементы громкости трека, его общую длину
wavesurfer.on("ready", () => {
  wavesurfer.setVolume(slider.value / 100);
  const range = wavesurfer.getDuration();
  totalRange.innerHTML = timeView(range);
});
//используем audioprocess для отображения текущего времени трека
wavesurfer.on("audioprocess", () => {
  const timeOn = wavesurfer.getCurrentTime();
  time.innerHTML = timeView(timeOn);
});

wavesurfer.on("finish", () => {
  playBtnIcon.src = "./assets/icons/play.svg";
});
