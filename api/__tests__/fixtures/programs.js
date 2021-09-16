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
  name: faker.lorem.word(),
  url: faker.internet.url(),
  degree,
  semester: "summer",
  applicationAvailable: faker.date.recent(),
  applicationDeadline: faker.date.future(),
  requiredDocuments,
  optionalDocuments,
});

module.exports = {
  generateProgram,
};
