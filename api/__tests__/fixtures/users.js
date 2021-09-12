const { ObjectId } = require("mongoose").Types;
const faker = require("faker");

const generateUser = (role) => ({
  _id: new ObjectId().toHexString(),
  name: faker.name.findName(),
  email: faker.unique(faker.internet.email).toLowerCase(),
  password: faker.internet.password(10, false, /[0-9A-Z]/),
  role,
});

const generateAgent = (studentIds) => ({
  ...generateUser(),
  students: studentIds,
})

const generateEditor = (studentIds) => ({
  ...generateUser(),
  students: studentIds,
})

const generateStudent = (agentIds, editorIds) => ({
  ...generateUser(),
  agents: agentIds,
  editors: editorIds,
})

module.exports = {
  generateUser,
  generateAgent,
  generateEditor,
  generateStudent,
};
