const User = require('../model/User.model');

const userCtrl = {
  FOLLOW_POST: async (req, res) => {
    const { userId, followId } = req.body;

    try {
      //
      if (userId === followId) {
        throw Error('User error!');
      }
      //
      const followUser = await User.findOne({ _id: followId });
      if (!followUser) {
        throw Error('User ' + followId + ' not found');
      }
      const blockUser = await User.findOne({ _id: followId, $all: { blocked: userId, blocking: followId } });
      if (blockUser) {
        throw Error('User ' + followId + ' not found!!!');
      }
      //
      const ísFollowing = await User.findOne({ _id: userId, following: { $in: [followUser] } });
      if (ísFollowing) {
        throw Error('User ' + followId + ' is following');
      }
      //
      await User.findByIdAndUpdate(userId, { $push: { following: followUser._id } });
      await User.findByIdAndUpdate(followId, { $push: { follower: userId } });
      return res.status(200).json({ message: 'Follow user ' + followId + ' done!' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  UN_FOLLOW_POST: async (req, res) => {
    const { userId, followId } = req.body;
    try {
      //
      if (userId === followId) {
        throw Error('User error!');
      }
      const followUser = await User.findOne({ _id: followId });
      if (!followUser) {
        throw Error('User ' + followId + ' not found');
      }
      //
      const ísFollowing = await User.findOne({ _id: userId, following: { $in: [followUser] } });
      if (!ísFollowing) {
        throw Error('User ' + followId + ' is not following');
      }
      //
      await User.findByIdAndUpdate({ _id: userId }, { $pull: { following: followUser._id } });
      return res.status(200).json({ message: 'Un follow user ' + followId + ' done!' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  BLOCK_POST: async (req, res) => {
    const { userId, blockId } = req.body;
    try {
      if (userId === blockId) {
        throw Error('User error');
      }
      //
      const blockUser = await User.findOne({ _id: blockId });
      if (!blockUser) {
        throw Error('User ' + blockId + ' not found');
      }
      //
      const ísBlocking = await User.findOne({ _id: userId, blocking: { $in: [blockUser] } });
      if (ísBlocking) {
        throw Error('User ' + blockId + ' is blocking');
      }
      //
      const user = await User.findByIdAndUpdate(userId, {
        $push: { blocking: blockUser._id },
        $pull: { following: blockUser._id, follower: blockUser._id },
      });
      await User.findByIdAndUpdate(blockUser._id, {
        $push: { blocked: user._id },
        $pull: { following: user._id, follower: user._id },
      });
      return res.status(200).json({ message: 'Block user ' + blockId + ' done!' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  UN_BLOCK_POST: async (req, res) => {
    const { userId, blockId } = req.body;

    try {
      if (userId === blockId) {
        throw Error('User error');
      }
      const blockUser = await User.findOne({ _id: blockId });
      if (!blockUser) {
        throw Error('User ' + blockId + ' not found');
      }
      //
      const ísBlocking = await User.findOne({ _id: userId, blocking: { $in: [blockUser] } });
      if (!ísBlocking) {
        throw Error('User ' + blockId + ' is not blocking');
      }
      //
      const user = await User.findByIdAndUpdate({ _id: userId }, { $pull: { blocking: blockUser._id } });
      await User.findByIdAndUpdate(blockUser._id, { $pull: { blocked: user._id } });
      return res.status(200).json({ message: 'Un block user ' + blockId + ' done!' });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  FIND_FOLLOWING_USER_GET: async (req, res) => {
    const { user } = req.query;
    try {
      const userList = await User.findById({ _id: user }).populate({ path: 'following', select: '_id, email' });
      res.status(200).json({ user: userList._id, followingList: userList.following });
    } catch (error) {
      res.status(400).json({ message: 'Something wrong!!!' });
    }
  },
  FIND_FOLLOWER_USER_GET: async (req, res) => {
    const { user } = req.query;
    try {
      const userList = await User.findById({ _id: user }).populate({ path: 'follower', select: '_id, email' });
      res.status(200).json({ user: userList._id, followerList: userList.follower });
    } catch (error) {
      res.status(400).json({ message: 'Something wrong!!!' });
    }
  },
  FIND_BLOCKING_USER_GET: async (req, res) => {
    const { user } = req.body;
    try {
      const userList = await User.findById({ _id: user }).populate({ path: 'blocking', select: '_id, email' });
      res.status(200).json({ user: userList._id, blockingList: userList.blocking });
    } catch (error) {
      res.status(400).json({ message: 'Something wrong!!!' });
    }
  },
};
module.exports = userCtrl;
