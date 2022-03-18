const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: 'Conversation' },
    sender: { type: mongoose.Types.ObjectId, ref: 'User' },
    body: { type: String },
  },
  { timestamps: true }
);

messageSchema.plugin(mongoosePaginate);
//
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
