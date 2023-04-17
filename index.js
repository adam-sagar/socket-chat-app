const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let nicknames = []

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('user connected', 'a user connected');
    socket.on('chat message', (msg) => {

        // socket.broadcast.emit('chat message', msg);
        console.log('message: ' + msg);
        const nickname = nicknames[socket.id] || 'Anonymous';
        console.log(nickname)
        const formattedMessage = `${nickname}: ${msg}`;
        io.emit('chat message', formattedMessage);
    });

    socket.on('nickname', (nickname) => {
        nicknames[socket.id] = nickname
        // socket.broadcast.emit('chat message', nickname);
        console.log(nicknames)
    });



    socket.on('disconnect', () => {
        console.log('a user disconnected');
        socket.broadcast.emit('user disconnected', 'a user disconnected');
    })
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});