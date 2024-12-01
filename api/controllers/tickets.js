const { is_TaiGer_role } = require('@taiger-common/core');
const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { Role } = require('../constants');
const { isNotArchiv } = require('../constants');
const {
  TicketCreatedAgentEmail,
  TicketResolvedRequesterReminderEmail
} = require('../services/email');

const getTickets = asyncHandler(async (req, res) => {
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
  if (is_TaiGer_role(user)) {
    const tickets = await req.db
      .model('Ticket')
      .find(query)
      .populate('program_id', 'school program_name degree')
      .populate('requester_id', 'firstname lastname email')
      .sort({ createdAt: -1 });
    res.send({ success: true, data: tickets });
  } else {
    const tickets = await req.db
      .model('Ticket')
      .find(query)
      .populate('program_id', 'school program_name degree')
      .sort({ createdAt: -1 });
    res.send({ success: true, data: tickets });
  }
});

const getTicket = asyncHandler(async (req, res) => {
  const { user } = req;
  if (user.role === Role.Student) {
    const ticket = await req.db
      .model('Ticket')
      .findById(req.params.ticketId)
      .select('-requester_id');
    if (!ticket) {
      logger.error('getTicket: Invalid ticket id');
      throw new ErrorResponse(404, 'Ticket not found');
    }
    res.send({ success: true, data: ticket });
  } else {
    const ticket = await req.db
      .model('Ticket')
      .findById(req.params.ticketId)
      .populate('requester_id', 'firstname lastname email ');
    if (!ticket) {
      logger.error('getTicket: Invalid ticket id');
      throw new ErrorResponse(404, 'Ticket not found');
    }
    res.send({ success: true, data: ticket });
  }
});

const createTicket = asyncHandler(async (req, res) => {
  const { user } = req;
  const new_ticket = req.body;
  new_ticket.requester_id = user._id.toString();
  // TODO: DO not create the same
  const ticket = await req.db.model('Ticket').create(new_ticket);

  res.status(201).send({ success: true, data: ticket });

  const programPromise = req.db
    .model('Program')
    .findById(new_ticket.program_id);
  const studentPromise = req.db
    .model('Student')
    .findById(user._id.toString())
    .populate('agents', 'firstname lastname email')
    .exec();

  const [program, student] = await Promise.all([
    programPromise,
    studentPromise
  ]);

  for (let i = 0; i < student.agents.length; i += 1) {
    if (isNotArchiv(student)) {
      TicketCreatedAgentEmail(
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

const updateTicket = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticket_id } = req.params;
  const fields = req.body;

  fields.updatedAt = new Date();
  // TODO: update resolver_id
  const updatedTicket = await req.db
    .model('Ticket')
    .findByIdAndUpdate(ticket_id, fields, {
      new: true
    })
    .populate('requester_id', 'firstname lastname email archiv')
    .populate('program_id', 'school program_name degree semester');

  res.status(200).send({ success: true, data: updatedTicket });

  // TODO: to avoid resolved many times
  if (fields?.status === 'resolved') {
    if (isNotArchiv(updatedTicket.requester_id)) {
      TicketResolvedRequesterReminderEmail(
        {
          firstname: updatedTicket.requester_id.firstname,
          lastname: updatedTicket.requester_id.lastname,
          address: updatedTicket.requester_id.email
        },
        {
          program: updatedTicket.program_id,
          student: updatedTicket.requester_id,
          taigerUser: user
        }
      );
    }
  }
});

const deleteTicket = asyncHandler(async (req, res) => {
  await req.db.model('Ticket').findByIdAndDelete(req.params.ticket_id);
  res.status(200).send({ success: true });
});

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket
};
