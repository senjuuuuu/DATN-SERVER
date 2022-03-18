const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    title: { type: mongoose.Types.ObjectId, ref: 'User' },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

conversationSchema.plugin(mongoosePaginate);
//
const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
