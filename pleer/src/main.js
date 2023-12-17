
const playBtn = document.querySelector(".playBtn");
const playBtnIcon = document.querySelector(".playBtnIcon");
const waveform = document.querySelector(".waveform");
const volumeIcon = document.querySelector(".vlmIcon");
const slider = document.querySelector(".slider");
const time = document.querySelector(".time");
const totalRange = document.querySelector(".totalRange");


const createWavesurfer = () => {
return WaveSurfer.create({
    container: '#waveform',
    responsive: true,
    heught: 100,
    waveColor: '#4F4A85',
    progressColor: '#383351',
  })
}

function turnPlay() {
    wavesurfer.playPause();

    const musicPlay = wavesurfer.isPlaying();

    if (musicPlay) {
        playBtnIcon.src = "./assets/icons/pause.svg";
    } else {
        playBtnIcon.src = "./assets/icons/play.svg";
    }
}

function checkVolume(e) {
    const volume = e.target.value / 100;
    wavesurfer.setVolume(volume);
    localStorage.setItem('playerVolume', volume);
}

function takeVolumeFromLocalStorage() {
    const volume = localStorage.getItem("playerVolume") * 100 || 50;
    slider.value = volume;
}

function timeView(sec) {
    return new Date(sec * 1000).toISOString().substr(11, 8);
}

function mute() {
    wavesurfer.toggleMute();

    const muted = wavesurfer.getMute();

    if (muted) {
        volumeIcon.src = "./assets/icons/mute.svg";
        slider.disabled = true;
    } else {
        slider.disabled = false;
        volumeIcon.src = "./assets/icons/volume.svg"
    }
}

const wavesurfer = createWavesurfer();
wavesurfer.load("./assets/audio/bamba.mp3");

window.addEventListener("load", takeVolumeFromLocalStorage);
playBtn.addEventListener("click", turnPlay);
volumeIcon.addEventListener("click", mute);
slider.addEventListener("input", checkVolume);

wavesurfer.on("ready", () => {
    wavesurfer.setVolume(slider.value / 100);
    const range = wavesurfer.getDuration();
    totalRange.innerHTML = timeView(range);
});

wavesurfer.on("audioproccess", () => {
    const timeOn = wavesurfer.getCurrentTime();
    time.innerHTML = timeView(timeOn);
});

wavesurfer.on("finish", () => {
    playBtnIcon.src = "./assets/icons/play.svg";
});
