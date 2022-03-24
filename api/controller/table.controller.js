const Table = require('../model/Table.model');
const Pin = require('../model/Pin.model');
const moment = require('moment');
const tableCtrl = {
  CREATE_TABLE_POST: async (req, res) => {
    const { title } = req.body;
    try {
      const table = await Table.create({ title: title, createBy: req.user.id });
      res.status(201).json({ message: 'Create done!', table });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  EDIT_TABLE_PUT: async (req, res) => {
    const { tableId, title, privacy } = req.body;
    const userId = req.user.id;
    try {
      const table = await Table.checkTable(tableId, userId);
      const tableEdit = await Table.findByIdAndUpdate(table._id, { title: title, privacy: privacy });
      res.status(201).json({ message: 'Update done!', tableId: tableEdit._id });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  DELETE_TABLE_DELETE: async (req, res) => {
    const { tableId } = req.body;
    const userId = req.user.id;
    try {
      const table = await Table.checkTable(tableId, userId);
      await Pin.findByIdAndUpdate(pinId, { $pull: { tables: table._id } });
      await Table.findByIdAndRemove(table._id);
      res.status(201).json({ message: 'Delete done!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  SAVE_PIN_POST: async (req, res) => {
    const { pinId, tableId } = req.body;
    try {
      const table = await Table.findByIdAndUpdate(tableId, { $push: { pins: pinId } });
      await Pin.findByIdAndUpdate(pinId, { $push: { tables: table._id } });
      res.status(201).json({ message: 'Save pin in ' + table.title + '  done!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  UN_SAVE_PIN_POST: async (req, res) => {
    const { pinId, tableId } = req.body;
    try {
      const table = await Table.findByIdAndUpdate(tableId, { $pull: { pins: pinId } });
      await Pin.findByIdAndUpdate(pinId, { $pull: { tables: table._id } });
      res.status(201).json({ message: 'Un save pin in ' + table.title + '  done!' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  FIND_TABLE_POST: async (req, res) => {
    const { name, limit, page } = req.query;
    const query = { privacy: 'public' };
    if (name) query.title = { $regex: new RegExp(name), $options: 'i' };
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
    };
    try {
      const tables = await Table.paginate(query, options);
      res.status(200).json(tables);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  },
  GET_DETAILS_TABLE_POST: async (req, res) => {
    const { user, limit, page } = req.query;
    const { tableId } = req.params;
    const userId = req.user.id;
    const query = { tables: { $in: tableId } };
    if (user !== userId) query.privacy = 'public';
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      populate: [
        {
          path: 'createBy',
          select: '_id displayName avatar follower',
        },
      ],
      sort: { createdAt: -1 },
      select: '_id file title link',
    };
    try {
      const pins = await Pin.paginate(query, options);
      res.status(200).json(pins);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  },
  GET_ALL_TABLE_BY_USER_GET: async (req, res) => {
    const { name, limit, page, user } = req.query;
    const userId = req.user.id;
    const query = { createBy: user };
    if (name) query.title = { $regex: new RegExp(name), $options: 'i' };
    if (user !== userId) query.privacy = 'public';
    const options = {
      limit: parseInt(limit) || 10,
      page: parseInt(page) || 1,
      populate: [
        { path: 'pins', select: '_id file updatedAt' },
        { path: 'createBy', select: '_id displayName avatar email follower following' },
      ],
    };
    try {
      const tables = await Table.paginate(query, options);
      console.log(moment(tables.docs.updatedAt).fromNow());
      const results = {};
      results.data = tables.docs;
      results.pagination = {
        limit: tables.limit,
        page: tables.page,
        total: tables.totalDocs,
      };
      res.status(200).json(results);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: error.message });
    }
  },
  FIND_TABLE_BY_ID_GET: async (req, res) => {
    const tableId = req.params.tableId;
    console.log(tableId);
    try {
      const table = await Table.findOne({ _id: tableId })
        .populate({
          path: 'createBy',
          select: '_id displayName avatar email following follower',
        })
        .populate({
          path: 'pins',
          populate: { path: 'createBy' },
        });
      res.status(200).json(table);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
module.exports = tableCtrl;
