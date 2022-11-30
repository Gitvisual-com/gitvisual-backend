const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getMessagesForConversation = {
  body: Joi.object.keys({
    id: Joi.required().custom(objectId),
    initialFetch: Joi.boolean().required(),
    lastId: Joi.when('initialFetch', {
      is: false,
      then: Joi.required().custom(objectId),
      otherwise: Joi.forbidden(),
    }),
  }),
};

const sendMessage = {
  body: Joi.object.keys({
    conversationId: Joi.required().custom(objectId),
    value: Joi.string().min(1).max(500).required(),
    receiver: Joi.required().custom(objectId),
  }),
};

const readMessages = {
  body: Joi.object.keys({
    conversationId: Joi.objectId().required(),
    messageIds: Joi.array().required(),
  }),
};

const sendMedia = {
  body: Joi.object.keys({
    conversationId: Joi.custom(objectId).required(),
    uuid: Joi.string().guid().required(),
    receiver: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  sendMessage,
  sendMedia,
  readMessages,
  getMessagesForConversation,
};
