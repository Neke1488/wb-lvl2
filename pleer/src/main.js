import WaveSurfer from 'https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.js'

const playBtn = document.querySelector(".playBtn");
const playBtnIcon = document.querySelector(".playBtnIcon");
const waveform = document.querySelector(".waveform");
const volumeIcon = document.querySelector(".vlmIcon");
const playlist = document.querySelector(".playlistList");
const playListSongs = document.querySelector(".songs").content.querySelector(".addSongs");
const nameArtistAndSong = document.querySelector(".title");
const audioFile = document.querySelector('.songFromPlayer');
const slider = document.querySelector(".slider");
const time = document.querySelector(".time");
const totalRange = document.querySelector(".totalRange");
const songName = ['bamba', 'Lil Tjay feat. Fivio Foreign, Pop Smoke-Zoo York',
'Playboi Carti-Pop Bottles', 'Russ Millions-6 30', 'YoungBoy Never Broke Again - 7 Days']
let indexSong;

if (localStorage.getItem('currentSong')) {
    indexSong = JSON.parse(localStorage.getItem('currentSong'));
} else {
    indexSong = 0;
}

const wavesurfer = WaveSurfer.create({
    container: waveform,
    height: 100,
    waveColor: '#4F4A85',
    progressColor: '#383351',
  })


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

function timeView(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
}

function mute() {
    if (wavesurfer.getMuted() == false) {
        wavesurfer.setMuted(true);
        volumeIcon.src = "./assets/icons/mute.svg";
        slider.disabled = true;
    } else {
        wavesurfer.setMuted(false);
        slider.disabled = false;
        volumeIcon.src = "./assets/icons/volume.svg"
    }
}

function showPlaylist(list) {
    list.forEach(item => {
        const playlistSongsPlace = playListSongs.cloneNode(true);
        playlistSongsPlace.querySelector(".nameForSong").textContent = item;
        playlist.append(playlistSongsPlace);
    })
}

showPlaylist(songName);

function chooseSong(event) {
    if (event.target.classList.contains('nameForSong')) {
        const currentSongName = event.target.closest('.addSongs').querySelector('.nameForSong').textContent;
        indexSong = songName.indexOf(currentSongName);
        showSongs(songName[indexSong]);
    }
}

function showSongs(songName) {
    nameArtistAndSong.innerHTML = songName;
    audioFile.src = `./assets/audio/${songName}.mp3`;
    wavesurfer.load(`./assets/audio/${songName}.mp3`);
}

playlist.addEventListener('click', chooseSong);

function saveLocalStorage(key, value) {
    localStorage.setItem(key,JSON.stringify(value));
}

saveLocalStorage('currentSong', indexSong);

window.addEventListener("load", takeVolumeFromLocalStorage);
showSongs(songName[indexSong]);
playBtn.addEventListener("click", turnPlay);
volumeIcon.addEventListener("click", mute);
slider.addEventListener("input", checkVolume);

wavesurfer.on("ready", () => {
    wavesurfer.setVolume(slider.value / 100);
    const range = wavesurfer.getDuration();
    totalRange.innerHTML = timeView(range);
});

wavesurfer.on("audioprocess", () => {
    const timeOn = wavesurfer.getCurrentTime();
    time.innerHTML = timeView(timeOn);
});

wavesurfer.on("finish", () => {
    playBtnIcon.src = "./assets/icons/play.svg";
});
