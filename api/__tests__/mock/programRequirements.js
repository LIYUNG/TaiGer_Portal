const { generateProgramRequirement } = require('../fixtures/faker');
const { program1, program2, program3 } = require('./programs');

const programRequirements1 = generateProgramRequirement(program1._id);
const programRequirements2 = generateProgramRequirement(program2._id);
const programRequirementsNew = generateProgramRequirement(program3._id);

const programRequirementss = [programRequirements1, programRequirements2];

module.exports = {
  programRequirements1,
  programRequirements2,
  programRequirementsNew,
  programRequirementss
};
