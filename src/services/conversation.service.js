const sendMessage = (req, data) => {
  const io = req.app.get('socketio');

  const { message, receiver } = { ...data };
  io.sockets.in(receiver._id).emit('newMessage', {
    ...message,
  });
};

const sendReadMessage = (req, data) => {
  const io = req.app.get('socketio');

  const { messageIds, roomId, receiver } = { ...data };
  io.sockets.in(receiver).emit('readMessages', {
    messageIds,
    roomId,
  });
};

const sendImageMessageRequest = (req, data) => {
  const io = req.app.get('socketio');

  const { message, receiver } = { ...data };
  io.sockets.in(receiver._id).emit('imageMessageRequest', {
    ...message,
  });
};

const sendImageMessage = (req, data) => {
  const io = req.app.get('socketio');

  const { message, receiver } = { ...data };
  io.sockets.in(receiver._id).emit('imageMessage', {
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
  sendReadMessage,
  sendImageMessageRequest,
  sendImageMessage,
  sendRoom,
  sendActivityStatus,
};
