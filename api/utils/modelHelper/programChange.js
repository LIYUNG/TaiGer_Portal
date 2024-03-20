const { Student } = require('../../models/User');
const { Documentthread } = require('../../models/Documentthread');
const {
  createApplicationThread,
  deleteApplicationThread
} = require('../../controllers/documents_modification');
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
      (application) => application.programId.toString() === programId.toString()
    );
    const threadIds =
      application?.doc_modification_thread.map((thread) =>
        thread.doc_thread_id.toString()
      ) || [];
    studentsThreadMap[student._id] = threadIds;
  }
  return studentsThreadMap;
};

const getProgramReqiredTypeCount = (program) => {
  const docRequired = {};
  docRequired.ml = program.ml_required.toLowerCase() === 'yes' ? 1 : 0;
  docRequired.rl = parseInt(program.rl_required);
  docRequired.essay = program.essay_required.toLowerCase() === 'yes' ? 1 : 0;
  docRequired.portfolio =
    program.portfolio_required.toLowerCase() === 'yes' ? 1 : 0;
  docRequired.supplementaryForm =
    program.supplementary_form_required.toLowerCase() === 'yes' ? 1 : 0;
  return docRequired;
};

const handleThreadDelta = async (program, studentsThreadMap) => {
  const requirement = getProgramReqiredTypeCount(program);
  console.log('handleThreadDelta ->', program, requirement, studentsThreadMap);
  for (let studentId in studentsThreadMap) {
    threadIds = studentsThreadMap[studentId];
    const types1 = await Documentthread.find(
      {
        student_id: studentId,
        program_id: program._id
      },
      { _id: 0 }
    )
      .select('file_type')
      .lean();
    const types2 = await Documentthread.find(
      { _id: { $in: threadIds } },
      { _id: 0 }
    )
      .select('file_type')
      .lean();
    console.log(
      'handleThreadDelta ->',
      studentId,
      types1.map((type) => type.file_type),
      types2.map((type) => type.file_type)
    );
  }
};

module.exports = {
  isCrucialChanges,
  findAffectedStudents,
  handleThreadDelta
};
