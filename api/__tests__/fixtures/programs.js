const { ObjectId } = require('mongoose').Types;
const faker = require('faker');

const generateProgram = (requiredDocuments, optionalDocuments) => ({
  _id: new ObjectId().toHexString(),
  school: faker.company.companyName(),
  program_name: faker.lorem.word(),
  degree: faker.lorem.word(),
  website: faker.internet.url(),
  semester: 'summer',
  application_start: faker.date.recent(),
  application_deadline: faker.date.future(),
  isArchiv: false,
  ml_required: true,
  requiredDocuments,
  optionalDocuments
});

module.exports = {
  generateProgram
};
