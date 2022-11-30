const httpStatus = require('http-status');

const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { conversationService } = require('../services');

const sendMedia = (req, res) => {
  const message = {
    roomId: req.body.conversationId,
    sender: req.userData.userId,
    receiver: req.body.receiver,
    messageType: req.body.messageType,
    media: req.file,
  };

  conversationService.createMessage(message);
  const updatePayload = {
    $inc: { messageCount: 1 },
  };
  conversationService.updateConversationById(req.body.conversationId, updatePayload);

  messageHandler.sendImageMessage(req, {
    message: { ...result.toObject(), uuid: req.body.uuid },
    receiver: JSON.parse(req.body.receiver),
  });
  res.status(200).json({ message: { ...result.toObject(), uuid: req.body.uuid } });
};

const getChatRooms = (req, res) => {
  ChatRoom.getRooms(mongoose.Types.ObjectId(req.userData.userId))
    .then((rooms) => {
      res.status(200).json({ rooms });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

const getMessagesForConversation = (req, res) => {
  let query = null;
  if (req.body.initialFetch) {
    query = { roomId: req.body._id };
  } else {
    query = {
      $and: [
        {
          _id: {
            $lt: req.body.lastId,
          },
          roomId: req.body._id,
        },
      ],
    };
  }
  Message.find(query)
    .limit(50)
    .sort({ createdAt: -1 })
    .then((result) => {
      res.status(200).json({ messages: result });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

const sendMessage = (req, res) => {
  new Message({
    roomId: req.body.roomId,
    sender: req.userData.userId,
    text: req.body.value,
    receiver: req.body.receiver._id,
    messageType: 'text',
  })
    .save()
    .then((result) => {
      ChatRoom.findByIdAndUpdate({ _id: req.body.roomId }, { $inc: { messages: 1 } })
        .then((result) => console.log(result))
        .catch((err) => {
          console.log(err.message);
        });
      messageHandler.sendMessage(req, {
        message: { ...result.toObject() },
        receiver: req.body.receiver,
      });
      res.status(200).json({ message: { ...result.toObject(), uuid: req.body.uuid } });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

const readMessages = (req, res) => {
  const receiverId = req.room.members.filter((member) => member.toString().trim() !== req.userData.userId.toString().trim());
  Message.updateMany(
    {
      _id: { $in: req.body.messageIds },
      receiver: mongoose.Types.ObjectId(req.userData.userId),
    },
    { $set: { read: true } },
    { multi: true }
  )
    .then(() => {
      messageHandler.sendReadMessage(req, {
        messageIds: req.body.messageIds,
        receiver: receiverId[0],
        roomId: req.room._id,
      });
      res.status(200).json({ read: 'messages' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: err.message });
    });
};

module.exports = {
  sendMedia,
  sendMessage,
  readMessages,
  getMessagesForConversation,
};
