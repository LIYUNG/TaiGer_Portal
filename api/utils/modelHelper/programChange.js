const { Student } = require('../../models/User');
const logger = require('../../services/logger');

const isCrucialChanges = (changes) => {
  const crucialChanges = [
    'ml_required',
    'rl_required',
    'essay_required',
    'portfolio_required',
    'supplementary_form_required'
  ];
  for (let change in changes) {
    if (crucialChanges.includes(change)) {
      return true;
    }
  }
  return false;
};

const findAffectedStudents = async (programId) => {
  const students = await Student.find({
    applications: {
      $elemMatch: {
        programId: programId
      }
    }
  }).lean();

  const studentsThreadMap = {};
  for (let student of students) {
    const application = student.applications.find(
      (application) => application.programId === programId
    );
    studentsThreadMap[student._id] = application?.doc_modification_thread || [];
  }
  return studentsThreadMap;
};

const handleMissingThreads = async (program, studentsThreadMap) => {
  console.log('handleMissingThreads ->', program, studentsThreadMap);
};

module.exports = {
  isCrucialChanges,
  findAffectedStudents,
  handleMissingThreads
};
