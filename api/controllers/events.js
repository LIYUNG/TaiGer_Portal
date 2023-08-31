// const path = require('path');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Event = require('../models/Event');
const { Agent, Role } = require('../models/User');

const async = require('async');
const {
  MeetingInvitationEmail,
  MeetingConfirmationReminderEmail,
  MeetingAdjustReminderEmail
} = require('../services/email');

const MeetingAdjustReminder = (receiver, user, start_time) => {
  MeetingAdjustReminderEmail(
    {
      id: receiver._id.toString(),
      firstname: receiver.firstname,
      lastname: receiver.lastname,
      address: receiver.email
    },
    {
      taiger_user_firstname: user.firstname,
      taiger_user_lastname: user.lastname,
      meeting_time: start_time, // Replace with the actual meeting time
      student_id: user._id.toString()
    }
  );
};
const meetingInvitation = (receiver, user, event) => {
  MeetingInvitationEmail(
    {
      id: receiver._id.toString(),
      firstname: receiver.firstname,
      lastname: receiver.lastname,
      address: receiver.email
    },
    {
      taiger_user_firstname: user.firstname,
      taiger_user_lastname: user.lastname,
      meeting_time: event.start, // Replace with the actual meeting time
      student_id: user._id.toString(),
      meeting_link: event.meetingLink
    }
  );
};
const meetingConfirmationReminder = (receiver, user, start_time) => {
  MeetingConfirmationReminderEmail(
    {
      id: receiver._id.toString(),
      firstname: receiver.firstname,
      lastname: receiver.lastname,
      address: receiver.email
    },
    {
      taiger_user_firstname: user.firstname,
      taiger_user_lastname: user.lastname,
      meeting_time: start_time, // Replace with the actual meeting time
      student_id: user._id.toString()
    }
  );
};

const getEvents = asyncHandler(async (req, res) => {
  const { user } = req;
  let events;
  let agents_events;
  if (user.role === Role.Student) {
    events = await Event.find({ requester_id: user._id })
      .populate('receiver_id requester_id', 'firstname lastname email')
      .lean();
    const agents_ids = user.agents;
    const agents = await Agent.find({ _id: agents_ids }).select(
      'firstname lastname email selfIntroduction officehours timezone'
    );
    agents_events = await Event.find({
      receiver_id: { $in: agents_ids },
      requester_id: { $nin: [user._id] }
    })
      .select('start')
      .lean();
    return res.status(200).send({
      success: true,
      agents,
      data: events,
      booked_events: agents_events,
      hasEvents: events.length !== 0
    });
  }
  const agents = await Agent.find({ _id: user._id.toString() }).select(
    'firstname lastname email selfIntroduction officehours timezone'
  );
  if (user.role === Role.Agent) {
    events = await Event.find({
      $or: [{ requester_id: user._id }, { receiver_id: user._id }]
    })
      .populate('receiver_id requester_id', 'firstname lastname email')
      .lean();

    if (events.length === 0) {
      return res.status(200).send({
        success: true,
        agents,
        data: events,
        booked_events: [],
        hasEvents: false
      });
    }
  }

  return res.status(200).send({
    success: true,
    agents,
    data: events,
    booked_events: [],
    hasEvents: true
  });
});

const showEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const event = await Event.findById(event_id);

  try {
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    throw new ErrorResponse(400, err);
  }
});

const postEvent = asyncHandler(async (req, res) => {
  const { user } = req;
  const newEvent = req.body;
  let events;
  if (user.role === Role.Student) {
    let write_NewEvent;
    newEvent.isConfirmedRequester = true;
    console.log(newEvent.start);
    // const date = new Date(newEvent.start);
    // newEvent.meetingLink = `https://meet.jit.si/${user.firstname}_${
    //   user.lastname
    // }_${date.toISOString()}_${user._id.toString()}`;

    // Check if there is already future timeslot, same student?
    const currentDate = new Date();
    events = await Event.find({
      $or: [
        { start: newEvent.start }, // Start date is the same as the provided date
        {
          start: { $gt: currentDate }, // Start date is in the future
          requester_id: newEvent.requester_id // Same requester_id
        }
      ]
    })
      .populate('requester_id receiver_id', 'firstname lastname email')
      .lean();
    // Check if there is already booked upcoming events
    // console.log(events.length);
    // console.log(events.length);
    if (events.length === 0) {
      // TODO: additional check if the timeslot is in agent office hour?
      write_NewEvent = await Event.create(newEvent);
      await write_NewEvent.save();
    } else {
      throw new ErrorResponse(
        429,
        'You are not allowed to book further timeslot, if you have already an upcoming timeslot.'
      );
    }
    events = await Event.find({
      requester_id: newEvent.requester_id
    })
      .populate('requester_id receiver_id', 'firstname lastname email')
      .lean();
    const agents_ids = user.agents;
    const agents = await Agent.find({ _id: agents_ids }).select(
      'firstname lastname email selfIntroduction officehours timezone'
    );
    res.status(200).send({
      success: true,
      agents,
      data: events,
      hasEvents: events.length !== 0
    });

    // TODO Sent email to receiver
    const updatedEvent = await Event.findById(write_NewEvent._id)
      .populate('requester_id receiver_id', 'firstname lastname email')
      .lean();

    updatedEvent.receiver_id.forEach((receiver) => {
      meetingConfirmationReminder(receiver, user, updatedEvent.start);
    });
  } else {
    events = await Event.find({
      start: newEvent.start,
      $or: [
        { requester_id: newEvent.requester_id },
        { receiver_id: newEvent.requester_id }
      ]
    })
      .populate('receiver_id', 'firstname lastname email')
      .lean();
    // Check if there is any already booked upcoming events
    if (events.length === 0) {
      const write_NewEvent = await Event.create(newEvent);
      await write_NewEvent.save();
    } else {
      throw new ErrorResponse(
        429,
        'You are not allowed to book further timeslot, if you have already an upcoming timeslot.'
      );
    }
    events = await Event.find({
      requester_id: newEvent.requester_id
    });
    const agents_ids = user.agents;
    const agents = await Agent.find({ _id: agents_ids }).select(
      'firstname lastname email selfIntroduction officehours timezone'
    );
    res.status(200).send({
      success: true,
      agents,
      data: events,
      hasEvents: events.length !== 0
    });
  }
});

const confirmEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const { user } = req;
  const updated_event = req.body;
  try {
    console.log(updated_event.start);
    const date = new Date(updated_event.start);
    if (user.role === 'Student') {
      updated_event.isConfirmedRequester = true;
      updated_event.meetingLink = `https://meet.jit.si/${user.firstname}_${
        user.lastname
      }_${date
        .toISOString()
        .replace(/:/g, '_')
        .replace(/\./g, '_')}_${user._id.toString()}`;
    }
    if (user.role === 'Agent') {
      updated_event.isConfirmedReceiver = true;
      updated_event.meetingLink = `https://meet.jit.si/${user.firstname}_${
        user.lastname
      }_${date
        .toISOString()
        .replace(/:/g, '_')
        .replace(/\./g, '_')}_${user._id.toString()}`;
    }
    updated_event.end = new Date(date.getTime() + 60000 * 30);
    // console.log(date.toISOString());
    // console.log(date.toISOString().replace(/:/g, '_'));
    // console.log(date.toISOString().replace(/:/g, '_').replace(/\./g, '_'));
    // console.log(updated_event.meetingLink);
    const event = await Event.findByIdAndUpdate(event_id, updated_event, {
      upsert: false,
      new: true
    })
      .populate('receiver_id requester_id', 'firstname lastname email')
      .lean();
    if (event) {
      res.status(200).send({ success: true, data: event });
    }
    if (!event) {
      res.status(404).json({ error: 'event is not found' });
    }
    // TODO Sent email to requester

    if (user.role === 'Student') {
      event.receiver_id.forEach((receiver) => {
        meetingInvitation(receiver, user, event);
      });
    }
    if (user.role === 'Agent') {
      event.requester_id.forEach((requester) => {
        meetingInvitation(requester, user, event);
      });
    }
  } catch (err) {
    console.log(err);
    throw new ErrorResponse(400, err);
  }
});

const updateEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const { user } = req;
  const updated_event = req.body;
  try {
    const date = new Date(updated_event.start);
    if (user.role === 'Student') {
      updated_event.isConfirmedRequester = true;
      updated_event.isConfirmedReceiver = false;
      // updated_event.meetingLink = `https://meet.jit.si/${user.firstname}_${
      //   user.lastname
      // }_${date.toISOString()}_${user._id.toString()}`;
    }
    if (user.role === 'Agent') {
      updated_event.isConfirmedRequester = false;
      updated_event.isConfirmedReceiver = true;
    }

    updated_event.end = new Date(date.getTime() + 60000 * 30);
    const event = await Event.findByIdAndUpdate(event_id, updated_event, {
      upsert: false,
      new: true
    })
      .populate('receiver_id requester_id', 'firstname lastname email')
      .lean();
    if (event) {
      res.status(200).send({ success: true, data: event });
    }
    if (!event) {
      res.status(404).json({ error: 'event is not found' });
    }
    // TODO Sent email to receiver
    // TODO: sync with google calendar.
    if (user.role === 'Student') {
      event.receiver_id.forEach((receiver) => {
        MeetingAdjustReminder(receiver, user, event.start);
      });
    }
    if (user.role === 'Agent') {
      event.requester_id.forEach((requester) => {
        MeetingAdjustReminder(requester, user, event.start);
      });
    }
  } catch (err) {
    console.log(err);
    throw new ErrorResponse(400, err);
  }
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { event_id } = req.params;
  const { user } = req;
  try {
    await Event.findByIdAndDelete(event_id);
    let events;
    if (user.role === Role.Student) {
      events = await Event.find({ requester_id: user._id })
        .populate('receiver_id requester_id', 'firstname lastname email')
        .lean();
      const agents_ids = user.agents;
      const agents = await Agent.find({ _id: agents_ids }).select(
        'firstname lastname email selfIntroduction officehours timezone'
      );
      if (events.length === 0) {
        return res
          .status(200)
          .send({ success: true, agents, data: [], hasEvents: false });
      }
      return res
        .status(200)
        .send({ success: true, agents, data: events, hasEvents: true });
    }
    if (user.role === Role.Agent) {
      events = await Event.find({
        $or: [
          { requester_id: user._id.toString() },
          { receiver_id: user._id.toString() }
        ]
      })
        .populate('receiver_id requester_id', 'firstname lastname email')
        .lean();
      const agents = await Agent.find({ _id: user._id.toString() }).select(
        'firstname lastname email selfIntroduction officehours timezone'
      );
      if (events.length === 0) {
        return res
          .status(200)
          .send({ success: true, agents, data: [], hasEvents: false });
      }
      return res
        .status(200)
        .send({ success: true, agents, data: events, hasEvents: true });
    }

    res.status(200).send({ success: true, hasEvents: false });
    // TODO: remind receiver or reqester
  } catch (err) {
    throw new ErrorResponse(400, err);
  }
});

module.exports = {
  getEvents,
  showEvent,
  postEvent,
  confirmEvent,
  updateEvent,
  deleteEvent
};
