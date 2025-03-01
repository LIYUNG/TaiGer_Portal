const { generateComlaintTicket } = require('../fixtures/faker');
const { student } = require('./user');

const ticket = generateComlaintTicket({
  requesterId: student._id
});
const ticket2 = generateComlaintTicket({
  requesterId: student._id
});
const ticket3 = generateComlaintTicket({
  requesterId: student._id
});
const ticketNew = generateComlaintTicket({
  requesterId: student._id,
  userId: student._id
});

const ticketWithMessage = generateComlaintTicket({
  requesterId: student._id,
  withMessage: true,
  userId: student._id
});
const tickets = [ticket, ticket2, ticket3, ticketWithMessage];

module.exports = {
  ticket,
  ticket2,
  ticket3,
  ticketNew,
  ticketWithMessage,
  tickets
};
