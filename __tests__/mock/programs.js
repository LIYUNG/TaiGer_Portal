const { generateProgram } = require('../fixtures/faker');

const program1 = generateProgram();
const program2 = generateProgram();
const program3 = generateProgram();
const program4 = generateProgram();
const program5 = generateProgram();
const programs = [program1, program2, program3, program4, program5];

module.exports = {
  program1,
  program2,
  program3,
  program4,
  program5,
  programs
};
