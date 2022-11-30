const express = require('express');

const auth = require('../../middlewares/auth');
const upload = require('../../middlewares/storage');
const validate = require('../../middlewares/validate');
const conversationController = require('../../controllers/conversation.controller');
const conversationValidaton = require('../../validations/conversation.validation');
const checkConversation = require('../../middlewares/checkConversation');

const router = express.Router();

router.get('/', auth('getConversations'), conversationController.getConversationRooms);

router.get(
  '/messages',
  auth('getMessages'),
  validate(conversationValidaton.getMessagesForConversation),
  conversationController.getMessagesForConversation
);

router.post(
  '/media',
  auth('sendMessages'),
  upload.single('file'),
  validate(conversationValidaton.sendMedia),
  checkConversation,
  conversationController.sendMedia
);

router.post(
  '/message',
  auth('sendMessages'),
  validate(conversationValidaton.sendMessage),
  checkConversation,
  conversationController.sendMessage
);

router.post(
  '/messages/read',
  auth('readMessages'),
  validate(conversationValidaton.readMessages),
  checkConversation,
  conversationController.readMessages
);

module.exports = router;
