const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Ticket = require('../models/Ticket');
const logger = require('../services/logger');
const { one_month_cache } = require('../cache/node-cache');

const getTickets = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find({
    type: req.query.type,
    program_id: req.query.program_id
  }).sort({ createdAt: -1 });
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
  return res.status(201).send({ success: true, data: ticket });
});

const updateTicket = asyncHandler(async (req, res) => {
  const { user } = req;
  const fields = req.body;

  fields.updatedAt = new Date();
  fields.requester_id = `${user.firstname} ${user.lastname}`;

  // Delete cache key for image, pdf, docs, file here.
  const value = one_month_cache.del(req.originalUrl);
  if (value === 1) {
    console.log('cache key deleted successfully due to update');
  }

  return res.status(200).send({ success: true, data: ticket });
});

const deleteTicket = asyncHandler(async (req, res) => {
  await Ticket.findByIdAndDelete(req.params.ticketId);
  console.log('The ticket deleted!');

  const value = one_month_cache.del(req.originalUrl);
  if (value === 1) {
    console.log('cache key deleted successfully due to delete');
  }

  res.status(200).send({ success: true });
});

module.exports = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,
  deleteTicket
};
