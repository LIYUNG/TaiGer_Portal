const { Student } = require('../../models/User');
const { Documentthread } = require('../../models/Documentthread');
const { RLs_CONSTANT } = require('../../constants.js');
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
  curriculum_analysis_required: 'Curriculum Analysis',
  scholarship_form_required: 'Scholarship ML',
  supplementary_form_required: 'Supplementary_Form'
};

const isCrucialChanges = (changes) => {
  const crucialChanges = [
    'ml_required',
    'rl_required',
    'is_rl_specific',
    'essay_required',
    'portfolio_required',
    'curriculum_analysis_required',
    'scholarship_form_required',
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
  // non-archived student has open application for program
  let students = await Student.find({
    applications: {
      $elemMatch: {
        programId: programId,
        closed: '-'
      }
    },
    archive: { $ne: true }
  })
    .select('_id')
    .lean();

  students = students.map((student) => student._id.toString());
  return students;
};

const checkIsRLspecific = (program) => {
  const isRLSpecific = program?.is_rl_specific;
  const NoRLSpecificFlag = isRLSpecific === undefined || isRLSpecific === null;
  return isRLSpecific || (NoRLSpecificFlag && program?.rl_requirements);
};

const handleRLDelta = async (program, studentId, threads) => {
  const nrRLneeded = parseInt(program.rl_required);
  const nrSpecRLNeeded = !checkIsRLspecific(program) ? 0 : nrRLneeded;

  const existingRL = threads.filter((thread) =>
    thread?.file_type?.startsWith('RL_')
  );
  existingRL
    .sort((a, b) => a?.file_type?.localeCompare(b?.file_type))
    .reverse();
  const nrSpecificRL = existingRL.length;

  // add missing RL
  if (nrSpecRLNeeded > nrSpecificRL) {
    const existingRLTypes = existingRL.map((thread) => thread.file_type);
    const availableRLs = RLs_CONSTANT.filter(
      (fileType) => !existingRLTypes.includes(fileType)
    );
    const missingRL = nrSpecRLNeeded - nrSpecificRL;
    for (let i = 0; i < missingRL && i < availableRLs.length; i++) {
      try {
        await createApplicationThread(studentId, program._id, availableRLs[i]);
        logger.error(
          `handleStudentDelta: create thread for student ${studentId} and program ${program._id} with file type RL (${availableRLs[i]})`
        );
      } catch (error) {
        logger.error(
          `handleStudentDelta: error on thread creation for student ${studentId} and program ${program._id} with file type RL -> error: ${error}`
        );
      }
    }
  }

  // remove extra RL
  if (nrSpecRLNeeded < nrSpecificRL) {
    const extraRL = nrSpecificRL - nrSpecRLNeeded;
    for (let i = 0; i < extraRL && i < existingRL.length; i++) {
      const thread = threads.find(
        (thread) => thread.file_type === existingRL[i]?.file_type
      );
      if (thread?.messages?.length !== 0) {
        logger.info(
          `handleStudentDelta: thread deletion aborted (non-empty thread) for student ${studentId} and program ${program._id} with file type RL -> messages exist`
        );
        continue;
      }
      try {
        await deleteApplicationThread(
          studentId?.toString(),
          program._id?.toString(),
          thread._id?.toString()
        );
        logger.error(
          `handleStudentDelta: delete thread for student ${studentId} and program ${program._id} with file type RL (${thread.file_type})`
        );
      } catch (error) {
        logger.error(
          `handleStudentDelta: error on thread deletion for student ${studentId} and program ${program._id} with file type RL -> error: ${error}`
        );
      }
    }
  }
};

const handleStudentDelta = async (studentId, program) => {
  const studentProgramThreads = await Documentthread.find({
    student_id: studentId,
    program_id: program._id
  }).lean();

  for (let fileType of Object.keys(FILETYPES)) {
    // RL is handled separately
    if (FILETYPES[fileType] === 'RL') {
      continue;
    }

    const fileThread = studentProgramThreads.find(
      (thread) => thread.file_type === FILETYPES[fileType]
    );

    if (program[fileType]?.toLowerCase() === 'yes' && !fileThread) {
      try {
        await createApplicationThread(
          studentId,
          program._id,
          FILETYPES[fileType]
        );
        logger.info(
          `handleStudentDelta: create thread for student ${studentId} and program ${program._id} with file type ${FILETYPES[fileType]}`
        );
      } catch (error) {
        logger.error(
          `handleStudentDelta: error on thread creation for student ${studentId} and program ${program._id} with file type ${FILETYPES[fileType]} -> error: ${error}`
        );
      }
    } else if (program[fileType]?.toLowerCase() !== 'yes' && fileThread) {
      if (fileThread?.messages?.length !== 0) {
        logger.info(
          `handleStudentDelta: thread deletion aborted (non-empty thread) for student ${studentId} and program ${program._id} with file type ${FILETYPES[fileType]} -> messages exist`
        );
        continue;
      }
      try {
        await deleteApplicationThread(
          studentId?.toString(),
          program._id?.toString(),
          fileThread._id?.toString()
        );
        logger.info(
          `handleStudentDelta: delete thread for student ${studentId} and program ${program._id} with file type ${FILETYPES[fileType]}`
        );
      } catch (error) {
        logger.error(
          `handleStudentDelta: error on thread deletion for student ${studentId} and program ${program._id} with file type ${FILETYPES[fileType]} -> error: ${error}`
        );
      }
    }
  }

  await handleRLDelta(program, studentId, studentProgramThreads);
};

const handleThreadDelta = async (program) => {
  const affectedStudents = await findAffectedStudents(program._id);
  for (let studentId of affectedStudents) {
    try {
      await handleStudentDelta(studentId, program);
    } catch (error) {
      console.log('error:', error);
      logger.error(
        `handleThreadDelta: error on student ${studentId} and program ${program._id}: ${error}`
      );
    }
  }
};

module.exports = {
  isCrucialChanges,
  findAffectedStudents,
  handleThreadDelta
};
