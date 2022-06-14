const { ObjectId } = require("mongoose").Types;
const faker = require("faker");

const { Degree } = require("../../models/Program");

const generateProgram = (
  requiredDocuments = [],
  optionalDocuments = [],
  degree = Degree.master
) => ({
  _id: new ObjectId().toHexString(),
  school: faker.company.companyName(),
  program_name: faker.lorem.word(),
  degree: faker.lorem.word(),
  website: faker.internet.url(),
  degree,
  semester: "summer",
  application_start: faker.date.recent(),
  application_deadline: faker.date.future(),
  // requiredDocuments,
  // optionalDocuments,
});

module.exports = {
  generateProgram,
};
