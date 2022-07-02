const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const users = {}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {  //triggers when connection (creats the socket)
  socket.on("new-user", names => {
    users[socket.id] = names
    socket.broadcast.emit("user-connected", names)
  })

  socket.on('chat message', (msg, room) => {  //captures the message from clint
    let toprint = users[socket.id] + " " + ": " + msg;
    console.log(users)
    if (room === "") {
      socket.broadcast.emit('chat message', toprint); //brodcast the message to everyone
    } else {
      socket.to(room).emit('chat message', toprint);
    }
  });
  socket.on("join-room", room => {
    socket.join(room);

  })

});

io.on('disconnect', () => {  //triggers when connection (creats the socket)
  socket.broadcast.emit('user-disconnected', users[socket.id]);
  delete users[socket.id]
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});