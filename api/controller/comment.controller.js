const Comment = require('../model/Comment.model');
const SubComment = require('../model/SubComment.model');
const commentCtrl = {
  CREATE_COMMENT_POST: async (req, res) => {
    const { pinId, body } = req.body;
    const userId = req.user.id;
    try {
      const newComment = await Comment.create({ pin: pinId, body, createBy: userId, subComment: [] });
      res.status(200).json(newComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  CREATE_SUB_COMMENT_POST: async (req, res) => {
    const { commentId, body } = req.body;
    const userId = req.user.id;
    try {
      const comment = await Comment.findOne({ _id: commentId });
      if (!comment) throw Error('Notfound comment');
      const newSubComment = await SubComment.create({ body, createBy: userId, mainComment: commentId });
      res.status(200).json(newSubComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  DELETE_COMMENT_DELETE: async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    try {
      const comment = await Comment.checkComment(commentId, userId);
      const deleteComment = await Comment.findByIdAndRemove(comment._id);
      const deleteSubComment = await Comment.deleteMany({ mainComment: comment._id });
      res.status(200).json({ message: 'Delete done' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  DELETE_SUB_COMMENT_PUT: async (req, res) => {
    const { subCommentId } = req.params;
    const userId = req.user.id;
    try {
      const subComment = await SubComment.checkComment(subCommentId, userId);
      const deleteSubComment = await SubComment.findByIdAndRemove(subComment._id);
      res.status(200).json({ message: 'Delete done' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  UPDATE_COMMENT_PUT: async (req, res) => {
    const { commentId, body } = req.body;
    const userId = req.user.id;
    try {
      const comment = await Comment.checkComment(commentId, userId);
      const updateComment = await Comment.findByIdAndUpdate(comment._id, { body: body });
      res.status(200).json(updateComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  UPDATE_SUB_COMMENT_PUT: async (req, res) => {
    const { subCommentId, body } = req.body;
    const userId = req.user.id;
    try {
      const comment = await SubComment.checkComment(subCommentId, userId);
      const updateSubComment = await SubComment.findByIdAndUpdate(comment._id, { body: body });
      res.status(200).json(updateSubComment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  GET_COMMENT_BY_PIN_GET: async (req, res) => {
    const { limit, page } = req.query;
    const { pinId } = req.params;
    const userId = req.user.id;
    const query = { pin: pinId };
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      populate: {
        path: 'createBy',
        select: '_id displayName avatar',
        where: { blocked: { $nin: userId }, blocking: { $nin: userId } },
      },
    };
    try {
      const comments = await Comment.paginate(query, options);
      res.status(200).json(comments);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  },
  GET_SUB_COMMENT_BY_COMMENT_GET: async (req, res) => {
    const { limit, page } = req.query;
    const { commentId } = req.params;
    const userId = req.user.id;
    const query = { mainComment: commentId };
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      populate: {
        path: 'createBy',
        select: '_id displayName avatar',
        where: { blocked: { $nin: userId }, blocking: { $nin: userId } },
      },
    };
    try {
      const subComments = await SubComment.paginate(query, options);
      res.status(200).json(subComments);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  },
  LIKE_COMMENT_PUT: async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    try {
      const comment = await Comment.findByIdAndUpdate(commentId, { $push: { likes: userId } });
      res.status(201).json({ message: 'Liked' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  UN_LIKE_COMMENT_PUT: async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    try {
      const comment = await Comment.findByIdAndUpdate(commentId, { $pull: { likes: userId } });
      res.status(201).json({ message: 'Un Liked' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  LIKE_SUB_COMMENT_PUT: async (req, res) => {
    const { subCommentId } = req.params;
    const userId = req.user.id;
    try {
      const subComment = await SubComment.findByIdAndUpdate(subCommentId, { $push: { likes: userId } });
      res.status(201).json({ message: 'Liked' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  UN_LIKE_SUB_COMMENT_PUT: async (req, res) => {
    const { subCommentId } = req.params;
    const userId = req.user.id;
    try {
      const subComment = await SubComment.findByIdAndUpdate(subCommentId, { $pull: { likes: userId } });
      res.status(201).json({ message: 'Un Liked' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = commentCtrl;
