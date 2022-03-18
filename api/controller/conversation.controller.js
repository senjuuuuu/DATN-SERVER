const Conversation = require('../model/Conversation.model');
const User = require('../model/User.model');

const conversationCtrl = {
  GET_CONVERSATION_BY_USER_GET: async (req, res) => {
    const { name, limit, page } = req.query;
    const userId = req.user.id;
    const query = { members: { $in: [userId] } };
    if (name) query.title = { $regex: new RegExp(name), $options: 'i' };
    const options = {
      populate: { path: 'members', select: '_id displayName avatar', match: { members: { $nin: [userId] } } },
      sort: { updatedAt: -1 },
    };
    if (limit && page) {
      options.limit = parseInt(limit) || 10;
      options.page = parseInt(page) || 1;
    }
    try {
      const conversation = await Conversation.paginate(query, options);
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  CREATE_CONVERSATION_POST: async (req, res) => {
    const { receiverId } = req.body;
    const userId = req.user.id;
    try {
      const receiverUser = await User.findOne({
        _id: receiverId,
        blocked: { $nin: [userId] },
        blocking: { $nin: [userId] },
      });
      if (!receiverUser) throw Error('Not found user');
      const conversation = await Conversation.create({ members: [userId, receiverUser._id] });
      res.status(200).json(conversation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  DELETE_CONVERSATION_POST: async (req, res) => {
    const { conversationId } = req.body;
    const userId = req.user.id;
    try {
      const conversation = await Conversation.findByIdAndUpdate(conversationId, { $pull: { members: userId } });
      res.status(200).json({ message: 'Delete done' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = conversationCtrl;
