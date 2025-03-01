const { generateAllCourse } = require('../fixtures/faker');

const subject1 = generateAllCourse();
const subject2 = generateAllCourse();
const subject3 = generateAllCourse();

const subjects = [subject1, subject2, subject3];

module.exports = {
  subject1,
  subject2,
  subject3,
  subjects
};
