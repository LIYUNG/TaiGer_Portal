const { Role } = require('../../constants');
const { generateUser } = require('../fixtures/faker');

const admin = generateUser(Role.Admin);
const agent = generateUser(Role.Agent);
const agent2 = generateUser(Role.Agent);
const agents = [agent, agent2];
const editor = generateUser(Role.Editor);
const editor2 = generateUser(Role.Editor);
const editors = [editor, editor2];
const students = [...Array(3)].map(() => generateUser(Role.Student));
const student = generateUser(Role.Student);
const student2 = generateUser(Role.Student);
const student3 = generateUser(Role.Student);
const users = [
  admin,
  ...agents,
  ...editors,
  ...students,
  student,
  student2,
  student3
];

module.exports = {
  admin,
  agent,
  agent2,
  agents,
  editor,
  editor2,
  editors,
  students,
  student,
  student2,
  student3,
  users
};
