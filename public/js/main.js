const chatForm = document.getElementById('chat-form');

const socket = io();

socket.on('msg', message => {
    console.log(message);
})

// Sending message
chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const msg = e.target.elements.msg.value;

    //emit msg to server
    socket.emit('chatMsg',msg);
})