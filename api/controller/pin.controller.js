const Pin = require('../model/Pin.model');
const User = require('../model/User.model');
const cloudinary = require('../config/cloudinary');
const Table = require('../model/Table.model');
const pinCtrl = {
  CREATE_PIN_POST: async (req, res) => {
    const { title, description, link, classify, tableId } = req.body;
    try {
      if (!req.file) {
        throw Error('File is empty!!');
      }
      const results = await cloudinary.uploader.upload(req.file.path, { folder: 'pin' });
      const table = await Table.findOne({ _id: tableId });
      const data = {
        title,
        description,
        link,
        classify,
        file: results.secure_url,
        cloudinary_id: results.public_id,
        createBy: req.user.id,
        tables: [table._id],
        privacy: table.privacy,
      };
      const pin = await Pin.create(data);
      table.pins.push(pin._id);
      await table.save();
      res.status(201).json(pin);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  EDIT_PIN_PUT: async (req, res) => {
    const { pinId, title, description, link, currentTableId, newTableId } = req.body;
    const userId = req.user.id;
    try {
      const pin = await Pin.checkPin(pinId, userId);
      const pinEdit = await Pin.findByIdAndUpdate(pin._id, {
        title: title,
        description: description,
        link: link,
        $pull: { tables: currentTableId },
        $push: { pins: newTableId },
      });
      await Table.findByIdAndUpdate(currentTableId, { $pull: { pins: pinEdit._id } });
      await Table.findByIdAndUpdate(newTableId, { $push: { pins: pinEdit._id } });
      res.status(201).json({ message: 'Edit pin done!', pinId: pinEdit._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  DELETE_PIN_DELETE: async (req, res) => {
    const { pinId } = req.body;
    const userId = req.user.id;
    try {
      const pin = await Pin.checkPin(pinId, userId);
      await Table.updateMany({ pins: { $in: [pin._id] } }, { $pull: { pins: pin._id } });
      await Pin.findByIdAndRemove(pin._id);
      res.status(400).json({ message: 'Delete pin done!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  HIDDEN_PIN_POST: async (req, res) => {
    const { pinId } = req.body;
    const userId = req.user.id;
    try {
      const pin = await Pin.findByIdAndUpdate(pinId, { $push: { hidden: userId } });
      res.status(201).json({ message: 'Hidden pin done!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  HOME_OR_SEARCH_PIN_POST: async (req, res) => {
    const { name, limit, page } = req.query;
    const userId = req.user.id;
    console.log(userId);
    const query = { hidden: { $nin: [userId] } };
    if (name) query = { ...query, 'classify.className': { $regex: new RegExp(name), $options: 'i' } };
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      populate: {
        path: 'createBy',
        match: { $and: [{ blocked: { $nin: [userId] } }, { blocking: { $nin: [userId] } }] },
      },
      select: '_id title description link file classify',
    };

    try {
      const pins = await Pin.paginate(query, options);
      const results = {};
      results.data = pins.docs;
      results.pagination = {
        limit: pins.limit,
        page: pins.page,
        total: pins.totalDocs,
      };
      res.status(200).json(results);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  },
  FOLLOWING_OR_SEARCH_PIN_POST: async (req, res) => {
    const { name, limit, page } = req.query;
    const userId = req.user.id;
    console.log(userId);
    const query = { hidden: { $nin: [userId] } };
    if (name) query = { ...query, 'classify.className': { $regex: new RegExp(name), $options: 'i' } };
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      populate: {
        path: 'createBy',
        match: { follower: { $in: [userId] } },
      },
      select: '_id title description link file classify',
    };
    try {
      const pins = await Pin.paginate(query, options);
      const results = {};
      results.data = pins.docs;
      results.pagination = {
        limit: pins.limit,
        page: pins.page,
        total: pins.totalDocs,
      };
      res.status(200).json(results);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  },
  GET_DETAILS_PIN_GET: async (req, res) => {
    const { pinId } = req.params;
    try {
      const pin = await Pin.findOne({ _id: pinId }).populate({
        path: 'createBy',
        select: '_id displayName avatar follower',
      });
      res.status(200).json(pin);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  GET_PIN_BY_USER_GET: async (req, res) => {
    const { name, limit, page, user } = req.query;
    const userId = req.user.id;
    const query = { hidden: { $nin: [userId] }, createBy: user };
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      select: '_id link file classify',
    };
    try {
      const pins = await Pin.paginate(query, options);
      const results = {};
      results.data = pins.docs;
      results.pagination = {
        limit: pins.limit,
        page: pins.page,
        total: pins.totalDocs,
      };
      res.status(200).json(results);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = pinCtrl;
