const container = document.querySelector(".container");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
const play = document.querySelector("#play");
const duration = document.querySelector("#duration");
const progressBar = document.querySelector("#progress-bar");
const volumeBar = document.querySelector("#volume-bar");
const volume = document.querySelector("#volume");

const current = document.querySelector("#current-time");
const audio = document.querySelector("#audio");
const img = document.querySelector("#music-image");
const title = document.querySelector(".title");
const singer = document.querySelector(".singer");

const ul = document.querySelector(".list-group");
const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
  const music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlaying();
});

function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  img.src = "img/" + music.img;
  audio.src = "mp3/" + music.file;
}
play.addEventListener("click", () => {
  const isMusicPlay = container.classList.contains("playing");
  if (isMusicPlay) {
    pauseMusic();
  } else {
    playMusic();
  }
});
//prev
prev.addEventListener("click", () => {
  prevMusic();
});
function prevMusic() {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlaying();
}
//next
next.addEventListener("click", () => {
  nextMusic();
});
function nextMusic() {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlaying();
}

function pauseMusic() {
  container.classList.remove("playing");
  play.querySelector("i").classList = "fa-solid fa-play";
  audio.pause();
}
function playMusic() {
  container.classList.add("playing");
  play.querySelector("i").classList = "fa-solid fa-pause";
  audio.play();
}
function calculateTime(seconds) {
  const minute = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);
  const totalSecond = second < 10 ? `0${second}` : `${second}`;
  const result = `${minute}:${totalSecond}`;
  return result;
}
//audio
audio.addEventListener("loadedmetadata", () => {
  duration.innerText = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progressBar.value = Math.floor(audio.currentTime);
  current.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
  current.textContent = calculateTime(progressBar.value);
  audio.currentTime = progressBar.value;
});
volumeBar.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value / 100;
  if (value == 0) {
    audio.muted = true;
    isMuted = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
  } else {
    audio.muted = false;
    isMuted = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
  }
});

let isMuted = "unmuted";
volume.addEventListener("click", () => {
  if (isMuted === "unmuted") {
    audio.muted = true;
    isMuted = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
    volumeBar.value = 0;
  } else {
    audio.muted = false;
    isMuted = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
    volumeBar.value = 100;
  }
});

function displayMusicList(list) {
  for (let i = 0; i < list.length; i++) {
    const liTag = `
 <li onclick="selectedMusic(this)" li-index="${i}"
 class="list-group-item d-flex justify-content-between align-items-center"
>
 <span>${list[i].getName()}</span>
 <span id="music-${i}"  class="badge bg-primary rounded-pill"></span>
 <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
</li>
`;
    ul.insertAdjacentHTML("beforeend", liTag);

    const liAudioDuration = ul.querySelector(`#music-${i}`);
    const liAudioTag = ul.querySelector(`.music-${i}`);
    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
}
function selectedMusic(li) {
  player.index = li.getAttribute("li-index");
  displayMusic(player.getMusic());
  playMusic();
  isPlaying();
}

function isPlaying() {
  for (li of ul.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }
    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
}

audio.addEventListener("ended", () => {
  nextMusic();
});
