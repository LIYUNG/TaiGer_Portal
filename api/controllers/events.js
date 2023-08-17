// const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Event = require('../models/Event');

const async = require('async');

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({});

  try {
    res.status(200).json(events);
  } catch (err) {}
});

const showEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const event = await Event.findById(id);

  try {
    res.status(200).json(event);
  } catch (err) {}
});

const postEvent = asyncHandler(async (req, res) => {
  const newEvent = await Event.create(req.body);
  console.log(req.body);
  try {
    await newEvent.save();
    return res.status(200).send({ success: true, data: newEvent });
  } catch (err) {
    throw new ErrorResponse(400, err);
  }
});

const updateEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const event = await Event.findOne({ _id: id });
    if (event) {
      Object.assign(event, req.body);
      event.save((err, event) => {
        if (err) {
          handleError(err, res);
        } else {
          res.status(200).json(event);
        }
      });
    }
    if (!event) {
      res.status(404).json({ error: 'event is not found' });
    }
  } catch (err) {}
});

const deleteEvent = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    await Event.findByIdAndRemove(id);
    res.status(200).json('Event has been deleted');
  } catch (err) {
    // handleError(err, res);
  }
});

module.exports = {
  getEvents,
  showEvent,
  postEvent,
  updateEvent,
  deleteEvent
};
