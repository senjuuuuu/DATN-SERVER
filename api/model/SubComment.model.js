const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const subCommentSchema = new mongoose.Schema(
  {
    body: { type: String },
    createBy: { type: mongoose.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    mainComment: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);
subCommentSchema.statics.checkComment = async function (commentId, userId) {
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
subCommentSchema.plugin(mongoosePaginate);
//
const SubComment = mongoose.model('SubComment', subCommentSchema);
module.exports = SubComment;
