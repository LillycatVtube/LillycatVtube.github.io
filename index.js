const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

const users = {}

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'chatroom.html'));
});


io.on('connection', (socket) => {
    socket.on('new-user', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
        console.log(`a user named ${name} connected`);
    });
    console.log(users);
    socket.on('user-changed', name => {
        users[socket.id] = name;
        console.log(`User has changed thie username to ${name} !`);
    });
    socket.on('chat message', (message) => {
        socket.broadcast.emit('chat message', { message: message, username: users[socket.id] });
  });

  
});


server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});