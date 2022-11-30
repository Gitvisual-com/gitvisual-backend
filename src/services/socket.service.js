const sendMessage = (req, data) => {
  const io = req.app.get('socketio');

  const { message, receiver } = { ...data };
  io.sockets.in(receiver._id).emit('newMessage', {
    ...message,
  });
};

const sendReadMessages = (req, data) => {
  const io = req.app.get('socketio');

  const { messageIds, roomId, receiver } = { ...data };
  io.sockets.in(receiver).emit('readMessages', {
    messageIds,
    roomId,
  });
};

const sendMediaMessageRequest = (req, data) => {
  const io = req.app.get('socketio');

  const { message, receiver } = { ...data };
  io.sockets.in(receiver._id).emit('mediaMessageRequest', {
    ...message,
  });
};

const sendMediaMessage = (req, data) => {
  const io = req.app.get('socketio');

  const { message, receiver } = { ...data };
  io.sockets.in(receiver._id).emit('mediaMessage', {
    ...message,
    receiver: receiver._id,
  });
};

const sendRoom = (req, data) => {
  const io = req.app.get('socketio');
  const { userId, room } = data;
  io.sockets.in(userId).emit('newRoom', {
    ...room,
    lastMessage: [],
  });
};

const sendActivityStatus = (data) => {
  const { req, user, userId, activityStatus } = data;
  const io = req.app.get('socketio');
  io.sockets.in(userId).emit('activityStatusUpdate', {
    activityStatus,
    user,
  });
};

module.exports = {
  sendMessage,
  sendReadMessages,
  sendMediaMessageRequest,
  sendMediaMessage,
  sendRoom,
  sendActivityStatus,
};
