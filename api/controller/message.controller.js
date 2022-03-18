const Message = require('../model/Message.model');
const Conversation = require('../model/Conversation.model');
const User = require('../model/User.model');
const messageCtrl = {
  GET_MESSAGE_GET: async (req, res) => {
    const { conversationId } = req.body;
    const { body, limit, page } = req.query;
    const query = { conversation: conversationId };
    if (body) query.body = { $regex: new RegExp(body), $options: 'i' };
    const options = {
      sort: { createdAt: -1 },
      populate: { path: 'sender', select: '_id displayName avatar', match: { members: { $nin: [userId] } } },
    };
    if (limit && page) {
      options.limit = parseInt(limit) || 10;
      options.page = parseInt(page) || 1;
    }
    try {
      const messages = await Message.paginate(query, options);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  CREATE_MESSAGE_GET: async (req, res) => {
    const { conversationId, body } = req.body;
    const sender = req.user.id;
    try {
      const conversation = await Conversation.findOne({ _id: conversationId });
      const userId = conversation.filter((arr) => arr === sender);
      const user = await User.findOne({ _id: userId, blocked: { $nin: [sender] }, blocking: { $nin: [sender] } });
      if (!user) throw Error('Can not sent message');
      const newMessage = await Message.create({ conversationId, sender, body });
      res.status(200).json(newMessage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = messageCtrl;
