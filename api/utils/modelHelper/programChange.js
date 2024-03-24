const { Student } = require('../../models/User');
const { Documentthread } = require('../../models/Documentthread');
const {
  createApplicationThread,
  deleteApplicationThread
} = require('../../controllers/documents_modification');
const logger = require('../../services/logger');

const FILETYPES = {
  rl_required: 'RL',
  ml_required: 'ML',
  essay_required: 'Essay',
  portfolio_required: 'Portfolio',
  supplementary_form_required: 'Supplementary_Form'
};

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
  })
    .select('_id')
    .lean();
  return students;
};

const checkIsRLspecific = (program) => {
  const isRLSpecific = program?.is_rl_specific;
  const NoRLSpecificFlag = isRLSpecific === undefined || isRLSpecific === null;
  return isRLSpecific || (NoRLSpecificFlag && program?.rl_requirements);
};

const handleStudentDelta = async (studentId, program) => {
  const studentProgramThreads = await Documentthread.find({
    student_id: studentId,
    program_id: program._id
  }).lean();
  // const existingTypes = studentProgramThreads.map((type) => type.file_type);

  for (let fileType of Object.keys(FILETYPES)) {
    if (FILETYPES[fileType] === 'RL') {
      continue;
    }

    const fileThread = studentProgramThreads.find(
      (thread) => thread.file_type === FILETYPES[fileType]
    );

    if (program[fileType]?.toLowerCase() === 'yes' && !fileThread) {
      await createApplicationThread(
        studentId,
        program._id,
        FILETYPES[fileType]
      );
      logger.info(
        `handleStudentDelta: create thread for student ${studentId} and program ${program._id} with file type ${FILETYPES[fileType]}`
      );
    } else if (program[fileType]?.toLowerCase() !== 'yes' && fileThread) {
      if (fileThread?.messages?.length !== 0) {
        logger.info(
          `handleStudentDelta: thread deletion aborted (non-empty thread) for student ${studentId} and program ${program._id} with file type ${FILETYPES[fileType]} -> messages exist`
        );
        continue;
      }
      console.log('delete fileThread:', fileThread._id.toString());
      await deleteApplicationThread(
        studentId?.toString(),
        program._id?.toString(),
        fileThread._id?.toString()
      );
      logger.info(
        `handleStudentDelta: delete thread for student ${studentId} and program ${program._id} with file type ${FILETYPES[fileType]}`
      );
    }
  }

  let missingDocs = [];
  let extraDocs = [];
  const nrRLNeeded = parseInt(program.rl_required);
  const nrSpecificRL = studentProgramThreads.filter((thread) =>
    thread?.file_type?.startsWith('RL_')
  ).length;
  const nrSpecRLNeeded = !checkIsRLspecific(program) ? 0 : nrRLNeeded;

  if (nrSpecRLNeeded !== 0) {
    if (nrSpecRLNeeded > nrSpecificRL) {
      missingDocs.push(
        `RL - ${nrRLNeeded} needed, ${nrSpecificRL} provided (${
          nrRLNeeded - nrSpecificRL
        } must be added)`
      );
      if (nrSpecRLNeeded < nrSpecificRL) {
        extraDocs.push(
          `RL - ${nrSpecRLNeeded} needed, ${nrSpecificRL} provided (${
            nrSpecificRL - nrSpecRLNeeded
          } can be removed)`
        );
      }
    }
  }

  // await createApplicationThread(studentId, programId, requiredType);
};

const handleThreadDelta = async (program) => {
  const affectedStudents = await findAffectedStudents(program._id);
  console.log('affectedStudents:', affectedStudents);
  for (let student of affectedStudents) {
    try {
      await handleStudentDelta(student._id, program);
    } catch (error) {
      console.log('error:', error);
      logger.error(
        `handleThreadDelta: error on student ${student._id} and program ${program._id}: ${error}`
      );
    }
  }
};

module.exports = {
  isCrucialChanges,
  findAffectedStudents,
  handleThreadDelta
};
