const { generateEvent } = require('../fixtures/faker');
const { student, student2, agent, agent2, student3 } = require('./user');

const event1 = generateEvent(student._id, agent._id, 1);
const event2 = generateEvent(student2._id, agent._id, 2);
const event3 = generateEvent(student._id, agent2._id, 3);
const eventNew = generateEvent(student3._id, agent2._id, 4);
const eventNew2 = generateEvent(student._id, agent._id, 5);

const events = [event1, event2, event3];

module.exports = {
  event1,
  event2,
  event3,
  eventNew,
  eventNew2,
  events
};
