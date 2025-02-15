const { generateInterview } = require('../fixtures/faker');
const { program1, program2 } = require('./programs');
const { student, student2 } = require('./user');

const interview1 = generateInterview(program1._id, student._id);
const interview2 = generateInterview(program2._id, student._id);
const interview3 = generateInterview(program1._id, student2._id);

const interviews = [interview1, interview2, interview3];

module.exports = {
  interview1,
  interview2,
  interview3,
  interviews
};
