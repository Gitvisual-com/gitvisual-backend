const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    conversationName: {
      type: String,
      default: '',
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
conversationSchema.plugin(toJSON);
conversationSchema.plugin(paginate);

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
