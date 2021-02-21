const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection',socket => {

    //send message only to user calling the 'connection'
    socket.emit('msg', 'Welcome to my chat');

    //send message to everybody else
    socket.broadcast.emit('msg','Someone has joined the chat');

    //send everyone message about someone elaving the chat
    socket.on('disconnect', () => {
        io.emit('msg','Someone has left');
    });

    //Catch coming chat messages
    socket.on('chatMsg', msg => {
        console.log(msg);
    })

})


const PORT = 3000 || process.env.PORT;

server.listen(PORT,() => console.log(`Server running on port ${PORT}`));
