const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');
const tableSchema = new mongoose.Schema(
  {
    title: { type: String },
    thumbnail: [{ type: String }],
    privacy: { type: String, default: 'public' },
    pins: [{ type: mongoose.Types.ObjectId, ref: 'Pin' }],
    createBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);
tableSchema.statics.checkTable = async function (tableId, userId) {
  const table = await this.findOne({ _id: tableId });
  if (table) {
    const allowTable = await this.findOne({ _id: table._id, createBy: userId });
    if (allowTable) {
      return allowTable;
    }
    throw Error('Not allow');
  }
  throw Error('Not found Table');
};
tableSchema.plugin(mongoosePaginate);
//
const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
