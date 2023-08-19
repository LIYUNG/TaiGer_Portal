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
    events = await Event.find({ requester_id: user._id })
      .populate('receiver_id', 'firstname lastname email')
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
    return res
      .status(200)
      .send({ success: true, data: events, hasEvents: true });
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
    const event = await Event.findByIdAndUpdate(event_id, req.body, {
      upsert: false
    });
    if (event) {
      Object.assign(event, req.body);
      await event.save();
      return res.status(200).send({ success: true });
    }
    if (!event) {
      return res.status(404).json({ error: 'event is not found' });
    }
  } catch (err) {}
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  try {
    await Event.findByIdAndDelete(event_id);
    res.status(200).send({ success: true });
  } catch (err) {
    throw new ErrorResponse(400, err);
  }
});

module.exports = {
  getEvents,
  showEvent,
  postEvent,
  updateEvent,
  deleteEvent
};
