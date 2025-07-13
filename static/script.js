console.log("Spotify script loaded");
let currentplaylist='Arijit%20Singh';
let songs = [];
let currentSong = new Audio();
let x=0;
let y=0;
function formatTime(seconds) {
   if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    // Pad seconds with leading zero if needed
    const formattedSecs = secs < 10 ? '0' + secs : secs;
    return `${mins}:${formattedSecs}`;
}
async function fetchSpotifyData(folder) {
    let data= await fetch(`fetchspotify/${folder}`)
    let res= await data.json()
    
    let tws=res['song'];
    console.log(tws);
    document.querySelector('.songlist').getElementsByTagName("ul")[0].innerHTML='';
    songs=[];
    for(let i=0;i<tws.length;i++){
        if(tws[i].endsWith(".mp3")){
           songs.push(
                 tws[i].split('.mp3')[0]
        );
}
}

document.querySelector('.library h4').innerHTML = folder.replaceAll('%20',' ');
console.log(y);
if( y==0)
  {
  currentSong.src = `/static/songs/${folder}/` + songs[0] + '.mp3';
}
console.log(currentSong.src);
    let songul=document.querySelector('.songlist').getElementsByTagName("ul")[0];
    for (const element of songs) {
        songul.innerHTML+=`<li><div class='headache'>
                          <img class="invert " src="/static/image/scores-note-notes-audio-svgrepo-com.svg" alt="" width="30px" height="30px">
                          <div class="info">
                            <div>${element.replaceAll('%20',' ')}</div>
                            <div>Arijit Singh</div>
                          </div>
                          </div>
                          <div class="playnow">
                            <span>Play Now</span>
                            <img class="invert " src="/static/image/play-button-svgrepo-com.svg" alt=""width="20px" height="20px">
                            
                          </div>
        </li>`
        
    }
    // console.log(document.querySelector('.songlist').getElementsByTagName("ul")[0]);
    Array.from(document.querySelector('.songlist').getElementsByTagName("li")).forEach((element)=>{
        console.log(element.querySelector('.info').firstElementChild.innerHTML);
        element.addEventListener('click',()=>{
          
          playmusic(element.querySelector('.info').firstElementChild.innerHTML.trim());
        })
        })

}
function playmusic(songname) {
  y++;
  // console.log(`songs/${currentplaylist}/` + songname+'.mp3');
  currentSong.src = `/static/songs/${currentplaylist}/` + songname + '.mp3';
  document.getElementById('play').innerHTML = `<img src="/static/image/pause.svg" alt="Pause">`;
  currentSong.play();
  document.querySelector('.songinfo').innerHTML = songname
  document.querySelector('.songtimmer').innerHTML = "0:00 / 0:00";
}
async function getplaylists() {
    let data= await fetch('/playlist');
    let res= await data.json();
    let array=res.song;
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
            let foldername=element;
            console.log(foldername);
            let a= await fetch(`/songs/${foldername}`);
            let info= await a.json();
            console.log( info);
            document.querySelectorAll('.cardholder')[0].innerHTML+=`<div data-folder="${foldername}" class="card">
             <div> <img src="/static/songs/${foldername}/cover.jpg" alt="">
              <button class="play-btn">&#9658;</button></div>
              <div><div class="text">${info.title}</div>
              <div class="text">${info.description}</div>
              <span class="text"><a href="">Pritam</a></span>,
              <span class="text"><a href="">Arijit Singh</a></span></div>
               
            </div>`


    }
  }

async function main() {

  await getplaylists();
  await fetchSpotifyData(currentplaylist);
    

  // play and pause functionality
  play.addEventListener('click',()=>{
    if(currentSong.paused){
      console.log(currentSong.src);
        currentSong.play();
        y++;
        play.innerHTML = `<img src="/static/image/pause.svg" alt="Plause">`;
        if (x==0){
          x++;
          document.querySelector('.songinfo').innerHTML = songs[0].replaceAll('%20',' ');
        }
    }else{
        currentSong.pause();
        play.innerHTML = `<img src="/static/image/play-button-svgrepo-com.svg" alt="Play">`;  
        
    }
  }) 
  // update song time and seekbar
currentSong.addEventListener('timeupdate',()=>{
  // document.querySelector('.songinfo').innerHTML = songs[0].replaceAll('%20',' ');
    let currentTime = currentSong.currentTime;
    let duration = currentSong.duration;
    document.querySelector('.songtimmer').innerHTML = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    let seekbar = document.querySelector('.circle');
    seekbar.style.left = (currentTime / duration) * 100 + '%';
  });
  currentSong.addEventListener('ended',()=>{
    play.innerHTML = `<img src="/static/image/play-button-svgrepo-com.svg" alt="Play">`;
  })
  // seekbar functionality
  document.querySelector('.seekbar').addEventListener('click', (e) => {
    const seekbar = document.querySelector('.circle');
    const seekbarWidth = document.querySelector('.seekbar').offsetWidth;
    const clickX = e.clientX - document.querySelector('.seekbar').getBoundingClientRect().left;
    const newTime = (clickX / seekbarWidth) * currentSong.duration;
    currentSong.currentTime = newTime;
    seekbar.style.left = (newTime / currentSong.duration) * 100 + '%';
  });
  document.querySelector('.harm').addEventListener('click',()=>{
    if(document.querySelector('.harm').src.endsWith('hamburger.svg')){
      document.querySelector('.left').style.left = '0%';
      document.querySelector('.harm').src = 'cross-svgrepo-com.svg';
  }
  else{
      document.querySelector('.left').style.left = '-100%';
      document.querySelector('.harm').src = 'hamburger.svg';
  }
})
// previous and next song functionality
document.getElementById('previous').addEventListener('click', () => {
    const currentSongName = currentSong.src.split('/').pop().split('.')[0];
    const currentIndex = songs.indexOf(currentSongName);
    
    if (currentIndex > 0) {
        playmusic(songs[currentIndex - 1]);
    } else {
        playmusic(songs[songs.length - 1]);
    }
});

document.getElementById('next').addEventListener('click', () => {
    const currentSongName = currentSong.src.split('/').pop().split('.')[0];
    const currentIndex = songs.indexOf(currentSongName);
    
    if (currentIndex < songs.length - 1) {
        playmusic(songs[currentIndex + 1]);
    } else {
        playmusic(songs[0]);
    }
});

document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('input', (e) => {
  const volume = e.target.value / 100;
  currentSong.volume = volume;
  if (volume === 0) {
    document.querySelector('.volumeimg').src = '/static/image/mute.svg';
  }
  else {
    document.querySelector('.volumeimg').src = '/static/image/volume.svg';
  }
})
Array.from(document.getElementsByClassName('card')).forEach((element)=>{
  element.addEventListener('click',async (iteam)=>{
    currentplaylist=iteam.currentTarget.dataset.folder;
    await fetchSpotifyData(iteam.currentTarget.dataset.folder);

  })
})
}
main()