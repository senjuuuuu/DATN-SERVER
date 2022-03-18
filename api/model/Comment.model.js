const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const commentSchema = new mongoose.Schema(
  {
    body: { type: String },
    createBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    pin: { type: mongoose.Types.ObjectId, ref: 'Pin' },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);
commentSchema.statics.checkComment = async function (commentId, userId) {
  const comment = await this.findOne({ _id: commentId });
  if (comment) {
    const allowComment = await this.findOne({ _id: comment._id, createBy: userId });
    if (allowComment) {
      return allowComment;
    }
    throw Error('Not allow');
  }
  throw Error('Not found comment');
};
commentSchema.plugin(mongoosePaginate);
//
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
