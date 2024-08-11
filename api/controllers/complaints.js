const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { Role } = require('../constants');
const { isNotArchiv } = require('../constants');
const {
  ComplaintCreatedAgentEmail,
  ComplaintResolvedRequesterReminderEmail
} = require('../services/email');

const getComplaints = asyncHandler(async (req, res) => {
  const { user } = req;

  const { type, program_id, status } = req.query;
  const query = {};
  if (type) {
    query.type = type;
  }
  if (program_id) {
    query.program_id = program_id;
  }
  if (status) {
    query.status = status;
  }
  if (user.role === Role.Student) {
    const tickets = await req.db
      .model('Complaint')
      .find()
      .select('-requester_id')
      .sort({ createdAt: -1 });
    res.send({ success: true, data: tickets });
  } else {
    const tickets = await req.db
      .model('Complaint')
      .find()
      .populate('requester_id', 'firstname lastname email')
      .sort({ createdAt: -1 });
    res.send({ success: true, data: tickets });
  }
});

const getComplaint = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticketId } = req.params;
  if (user.role === Role.Student) {
    const ticket = await req.db
      .model('Complaint')
      .findById(ticketId)
      .select('-requester_id');
    if (!ticket) {
      logger.error('getComplaint: Invalid ticket id');
      throw new ErrorResponse(404, 'Complaint not found');
    }
    res.send({ success: true, data: ticket });
  } else {
    const ticket = await req.db
      .model('Complaint')
      .findById(ticketId)
      .populate('messages.user_id', 'firstname lastname email ')
      .populate('requester_id', 'firstname lastname email ');
    if (!ticket) {
      logger.error('getComplaint: Invalid ticket id');
      throw new ErrorResponse(404, 'Complaint not found');
    }
    res.send({ success: true, data: ticket });
  }
});

const createComplaint = asyncHandler(async (req, res) => {
  const { user } = req;
  const new_ticket = req.body;
  new_ticket.requester_id = user._id.toString();
  // TODO: DO not create the same
  const ticket = await req.db.model('Complaint').create(new_ticket);

  res.status(201).send({ success: true, data: ticket });

  const program = await req.db.model('Program').findById(new_ticket.program_id);
  const student = await req.db
    .model('Student')
    .findById(user._id.toString())
    .populate('agents', 'firstname lastname email')
    .exec();
  for (let i = 0; i < student.agents.length; i += 1) {
    if (isNotArchiv(student)) {
      ComplaintCreatedAgentEmail(
        {
          firstname: student.agents[i].firstname,
          lastname: student.agents[i].lastname,
          address: student.agents[i].email
        },
        {
          program,
          student
        }
      );
    }
  }
});

const updateComplaint = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticket_id } = req.params;
  const fields = req.body;

  fields.updatedAt = new Date();
  // TODO: update resolver_id
  const updatedComplaint = await req.db
    .model('Complaint')
    .findByIdAndUpdate(ticket_id, fields, {
      new: true
    })
    .populate('requester_id', 'firstname lastname email archiv')
    .populate('program_id', 'school program_name degree semester');

  res.status(200).send({ success: true, data: updatedComplaint });

  // TODO: to avoid resolved many times
  if (fields?.status === 'resolved') {
    if (isNotArchiv(updatedComplaint.requester_id)) {
      ComplaintResolvedRequesterReminderEmail(
        {
          firstname: updatedComplaint.requester_id.firstname,
          lastname: updatedComplaint.requester_id.lastname,
          address: updatedComplaint.requester_id.email
        },
        {
          program: updatedComplaint.program_id,
          student: updatedComplaint.requester_id,
          taigerUser: user
        }
      );
    }
  }
});

const deleteComplaint = asyncHandler(async (req, res) => {
  await req.db.model('Complaint').findByIdAndDelete(req.params.ticket_id);
  res.status(200).send({ success: true });
});

module.exports = {
  getComplaints,
  getComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint
};
