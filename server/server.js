const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocation } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
   console.log('New user connected');

   /**
    * socket.emit - me to me
    * socket.broadcast.emit - me to everyone but me
    * io.emit - to everyone
    */

   socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

   socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

   socket.on('createdMessage', (message, callback) => {
      io.emit('newMessage', generateMessage(message.from, message.text));
      callback();
   });

   socket.on('getLocation', (location, callback) => {
      io.emit('newLocationMessage', generateLocation('Admin', location.lat, location.long));
   }, function () {
      callback();
   });

   socket.on('disconnect', () => {
      console.log('User was disconnected');
   });
});

server.listen(port, () => {
   console.log(`Server started on ${port}`);
});