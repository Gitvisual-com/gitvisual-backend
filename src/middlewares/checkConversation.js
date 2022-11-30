const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { Conversation } = require('../models');
const ApiError = require('../utils/ApiError');

const checkConversation = (req) => {
  const conversation = Conversation.find({
    members: { $in: mongoose.Types.ObjectId(req.userData.userId) },
    _id: mongoose.Types.ObjectId(req.body.roomId),
  });
  if (conversation) {
    if (conversation.length) {
      // eslint-disable-next-line prefer-destructuring
      req.conversation = conversation[0];
      return;
    }
    throw new ApiError(httpStatus.NOT_FOUND);
  }

  throw new ApiError(httpStatus.NOT_FOUND);
};

module.exports = checkConversation;
