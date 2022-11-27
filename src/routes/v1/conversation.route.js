const express = require('express');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/storage');
const conversationController = require('../controllers/conversationController');
const conversationValidator = require('../middleware/schemaValidators/conversationValidator');
const chechRoom = require('../middleware/chechRoom');

const router = express.Router();

router.get('/', auth('getConversations'), conversationController.getConversationRooms);

router.get(
  '/messages',
  auth('getMessages'),
  conversationValidator.getMessagesForRoom,
  conversationController.getMessagesForRoom
);

router.post(
  '/media',
  auth('sendMessages'),
  upload.single('file'),
  conversationValidator.sendImage,
  chechRoom,
  conversationController.createImageMessage
);

router.post(
  '/message',
  auth('sendMessages'),
  conversationValidator.sendMessage,
  chechRoom,
  conversationController.sendMessage
);

router.post(
  '/messages/read',
  auth('readMessages'),
  conversationValidator.readMessages,
  chechRoom,
  conversationController.readMessages
);

module.exports = router;
