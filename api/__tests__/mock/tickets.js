const { generateTicket } = require('../fixtures/faker');
const { program1, program2 } = require('./programs');
const { student, student2 } = require('./user');

const programTicket1 = generateTicket({
  programId: program1._id,
  requesterId: student._id
});

const programTicket2 = generateTicket({
  programId: program2._id,
  requesterId: student._id
});

const programTicket3 = generateTicket({
  programId: program1._id,
  requesterId: student2._id
});

const programTicketNew = generateTicket({
  programId: program1._id
});

const programTickets = [programTicket1, programTicket2, programTicket3];

module.exports = {
  programTicket1,
  programTicket2,
  programTicket3,
  programTicketNew,
  programTickets
};
