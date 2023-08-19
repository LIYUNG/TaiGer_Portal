// const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Event = require('../models/Event');
const { Agent, Role } = require('../models/User');

const async = require('async');

const getEvents = asyncHandler(async (req, res) => {
  const { user } = req;
  let events;
  if (user.role === Role.Student) {
    events = await Event.find({ student_id: user._id })
      .populate('taiger_user_id', 'firstname lastname email')
      .lean();
    const agents_ids = user.agents;
    if (events.length === 0) {
      const agent = await Agent.find({ _id: agents_ids }).select(
        'firstname lastname email selfIntroduction officehours timezone'
      );

      return res
        .status(200)
        .send({ success: true, data: agent, hasEvents: false });
    }
    res.status(200).send({ success: true, data: events, hasEvents: true });
  }

  const agents_ids = user.agents;
  if (events.length === 0) {
    const agent = await Agent.find({ _id: agents_ids }).select(
      'firstname lastname email selfIntroduction officehours timezone'
    );

    return res
      .status(200)
      .send({ success: true, data: agent, hasEvents: false });
  }
  res.status(200).send({ success: true, data: events, hasEvents: true });
});

const showEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const event = await Event.findById(event_id);

  try {
    res.status(200).json(event);
  } catch (err) {}
});

const postEvent = asyncHandler(async (req, res) => {
  const newEvent = await Event.create(req.body);
  try {
    await newEvent.save();
    return res.status(200).send({ success: true, data: newEvent });
  } catch (err) {
    console.log(err);
    throw new ErrorResponse(400, err);
  }
});

const updateEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  try {
    const event = await Event.findOne({ _id: event_id });
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
  const event_id = req.params.event_id;
  try {
    await Event.findByIdAndDelete(event_id);
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
