
const { ObjectId } = require("mongoose").Types;
const faker = require("faker");

const generateProgram = () => ({
  _id: new ObjectId(),
	University_: faker.lorem.word(),
  Program_: faker.lorem.word(),
  Degree_: faker.lorem.word(),
  Semester_: faker.lorem.word(),
  Want_: faker.lorem.word(),
  TOEFL_: faker.lorem.word(),
  IELTS_: faker.lorem.word(),
  TestDaF_: faker.lorem.word(),
  GMAT_: faker.lorem.word(),
  GRE_: faker.lorem.word(),
  Application_start_date_: faker.lorem.word(),
  Application_end_date_: faker.lorem.word(),
  Website_: faker.internet.url(),
  FPSOlink_: faker.lorem.word(),
  LastUpdate_: faker.lorem.word(),
  // applicationDocu_: ?,
});

module.exports = {
  generateProgram,
};
