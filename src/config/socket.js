const httpStatus = require('http-status');
const socketIO = require('socket.io');
const tokenService = require('../services/token.service');
const userService = require('../services/user.service');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('./tokens');

const io = socketIO();

io.use((socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    const token = socket.handshake.query.token.split(' ')[1];
    tokenService.verifyToken(token, tokenTypes.ACCESS, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      // eslint-disable-next-line no-param-reassign
      socket.userData = decoded;
      next();
    });
  } else {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'authentication error');
  }
}).on('connection', (socket) => {
  // Connection now authenticated to receive further events
  socket.join(socket.userData.userId);
  io.in(socket.userData.userId).clients((err, clients) => {
    userService.changeUserStatusById(socket.userData.userId, clients, io);
    console.log(clients);
  });
  socket.on('typing', (data) => {
    socket.to(data.userId).emit('typing', { conversationId: data.roomId });
  });
  socket.on('stoppedTyping', (data) => {
    socket.to(data.userId).emit('stoppedTyping', { conversationId: data.roomId });
  });
  socket.on('disconnect', () => {
    socket.leave(socket.userData.userId);
    io.in(socket.userData.userId).clients((err, clients) => {
      userService.changeUserStatusById(socket.userData.userId, clients, io);
      console.log(clients);
    });
  });
});

module.exports = io;
