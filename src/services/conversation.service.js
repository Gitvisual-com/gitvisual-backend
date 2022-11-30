const httpStatus = require('http-status');
const { Message, Conversation } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (messageBody) => {
  return Message.create(messageBody);
};

/**
 * Query for messages
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async (filter, options) => {
  const messages = await Message.paginate(filter, options);
  return messages;
};

/**
 * Get message by id
 * @param {ObjectId} id
 * @returns {Promise<Message>}
 */
const getMessageById = async (id) => {
  return Message.findById(id);
};

const getConversationById = async (id) => {
  return Conversation.findById(id);
};

/**
 * Get message by userId
 * @param {string} userId
 * @returns {Promise<Message>}
 */
const getMessagesByUserId = async (userId) => {
  return Message.find({ userId });
};

/**
 * Update message by id
 * @param {ObjectId} messageId
 * @param {Object} updateBody
 * @returns {Promise<Message>}
 */
const updateConversationById = async (conversationId, updateBody) => {
  const conversation = await getConversationById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  Object.assign(conversation, updateBody);
  await conversation.save();
  return conversation;
};

/**
 * Delete message by id
 * @param {ObjectId} messageId
 * @returns {Promise<Message>}
 */
const deleteMessageById = async (messageId) => {
  const message = await getMessageById(messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Message not found');
  }
  await message.remove();
  return message;
};

module.exports = {
  createMessage,
  queryMessages,
  getMessageById,
  getMessagesByUserId,
  updateConversationById,
  deleteMessageById,
};
