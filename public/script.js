// const { text } = require("express");

const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
var peer = new Peer(undefined, {
    path:'/peerjs',
    host:'/',
    port:'443'
}); 

let myVideoStream;

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {

    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream);
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    })

    let text = $('input');

    $('html').keydown((e) => {
        if(e.which == 13 && text.val().length !== 0)
        {
            socket.emit('message', text.val());
            text.val('');
        }
    })

    socket.on('createMessage', message => {
        $('#messages_id').append(`<li class="message"><b>user</b> <br/>${message}</li>`);
        scrollToBottom();
    })
});

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
});


const connectToNewUser = (userId, stream) => {
   const call = peer.call(userId, stream);
   const video = document.createElement('video');
   call.on('stream', userVideoStream => {
       addVideoStream(video, userVideoStream)
   });
};

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}

const scrollToBottom = () => {
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


// Mute our audio 
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled)
    {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }   else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
    
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>`;
    document.querySelector('.main__mute_button').innerHTML = html;
}


const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`;
    document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }else {
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
      <span>Play Video</span>
    `
    document.querySelector('.main__video_button').innerHTML = html;
  }

  const hideShow = () => {
     let right = document.getElementById('main_right');
     let left = document.getElementById('main_left');

    if(right.style.flex == 0.2)
    {
        right.style.flex = 0;
        left.style.flex = 1;
    }
    else{
        right.style.flex = 0.2;
        left.style.flex = 0.8;
    }
  };

// Side panel
  function openSideTab(evt, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    if(evt.currentTarget.classList.contains("active"))
    {
        evt.currentTarget.classList.remove("active");
        document.getElementById('main_left').style.flex = "1";
    }
    else
    {
        evt.currentTarget.className += " active";
        document.getElementById(tabName).style.display = "flex";
        document.getElementById(tabName).style.flexGrow = "1";
        document.getElementById(tabName).style.flexDirection = "column";
        document.getElementById(tabName).style.flex = "0.2";
        document.getElementById('main_left').style.flex = "0.8";

    }
}