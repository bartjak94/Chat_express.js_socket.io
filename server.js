const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const autoName = 'Server BOT';

io.on('connection',socket => {

    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //send message only to user calling the 'connection'
        socket.emit('msg', formatMessage(autoName,`You joined ${user.room}`));

        //send message to everybody else
        socket.broadcast.to(user.room).emit('msg', formatMessage(autoName,`${user.username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
        });
    })



    //send everyone message about someone leaving the chat
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit('msg',formatMessage(autoName,`${user.username} has left`));
        
            // Send users and room info
            io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
            });
        };
    });




    //Catch coming chat messages
    socket.on('chatMsg', message => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('msg', formatMessage(user.username,message));
    })

})


const PORT = 3000 || process.env.PORT;

server.listen(PORT,() => console.log(`Server running on port ${PORT}`));
