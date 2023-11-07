const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Ticket = require('../models/Ticket');
const logger = require('../services/logger');
const { Student } = require('../models/User');
const { isNotArchiv } = require('../constants');
const { Program } = require('../models/Program');
const { TicketCreatedAgentEmail } = require('../services/email');

const getTickets = asyncHandler(async (req, res) => {
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
  const tickets = await Ticket.find(query).sort({ createdAt: -1 });
  res.send({ success: true, data: tickets });
});

const getTicket = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.ticketId);
  if (!ticket) {
    logger.error('getTicket: Invalid ticket id');
    throw new ErrorResponse(403, 'Invalid ticket id');
  }
  res.send({ success: true, data: ticket });
});

const createTicket = asyncHandler(async (req, res) => {
  const { user } = req;
  const new_ticket = req.body;
  //   console.log(new_ticket);
  new_ticket.requester_id = user._id.toString();
  // TODO: DO not create the same
  const ticket = await Ticket.create(new_ticket);

  res.status(201).send({ success: true, data: ticket });

  const program = await Program.findById(new_ticket.program_id);
  const student = await Student.findById(user._id.toString())
    .populate('agents', 'firstname lastname email')
    .exec();
  for (let i = 0; i < student.agents.length; i += 1) {
    if (isNotArchiv(student)) {
      await TicketCreatedAgentEmail(
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
  const updatedTicket = await Ticket.findByIdAndUpdate(ticket_id, fields, {
    new: true
  });

  return res.status(200).send({ success: true, data: updatedTicket });
});

const deleteTicket = asyncHandler(async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.ticket_id);
  res.status(200).send({ success: true });
});

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket
};
