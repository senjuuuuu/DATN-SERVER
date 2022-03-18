const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const pinSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    link: { type: String },
    file: { type: String },
    cloudinary_id: { type: String },
    classify: [{ className: String, confidenceLevel: Number }],
    likes: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    tables: [{ type: mongoose.Types.ObjectId, ref: 'Table' }],
    hidden: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    createBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
pinSchema.statics.checkPin = async function (pinId, userId) {
  const pin = await this.findOne({ _id: pinId });
  if (pin) {
    const allowPin = await this.findOne({ _id: pin._id, createBy: userId });
    if (allowPin) {
      return allowPin;
    }
    throw Error('Not allow');
  }
  throw Error('Not found Pin');
};
pinSchema.plugin(mongoosePaginate);
//
const Pin = mongoose.model('Pin', pinSchema);
module.exports = Pin;
