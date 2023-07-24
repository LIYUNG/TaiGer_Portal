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
  } catch (err) {
    // handleError(err, res);
  }
});

const postEvent = asyncHandler(async (req, res) => {
  const newEvent = await new Event(req.body);

  try {
    await newEvent.save((err, event) => {
      if (err) {
        handleError(err, res);
      } else {
        res.status(200).json(event);
      }
    });
  } catch (err) {
    // handleError(err, res);
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
  } catch (err) {
    // console.log(err);
    // handleError(err, res);
  }
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
