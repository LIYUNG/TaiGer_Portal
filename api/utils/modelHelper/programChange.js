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
  curriculum_analysis_required: 'Curriculum_Analysis',
  scholarship_form_required: 'Scholarship_Form',
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

const findRLDelta = async (program, studentId, threads) => {
  let delta = {
    add: [],
    remove: []
  };

  const nrRLneeded = parseInt(program.rl_required);
  const nrSpecRLNeeded = !checkIsRLspecific(program) ? 0 : nrRLneeded;

  const existingRL = threads.filter((thread) =>
    thread?.file_type?.startsWith('RL_')
  );
  existingRL
    .sort((a, b) => a?.file_type?.localeCompare(b?.file_type))
    .reverse();
  const nrSpecificRL = existingRL.length;

  // find missing RL
  if (nrSpecRLNeeded > nrSpecificRL) {
    const existingRLTypes = existingRL.map((thread) => thread.file_type);
    const availableRLs = RLs_CONSTANT.filter(
      (fileType) => !existingRLTypes.includes(fileType)
    );
    const missingRL = nrSpecRLNeeded - nrSpecificRL;
    for (let i = 0; i < missingRL && i < availableRLs.length; i++) {
      delta.add.push({
        studentId,
        programId: program._id,
        fileType: availableRLs[i]
      });
    }
  }

  // find extra RL
  if (nrSpecRLNeeded < nrSpecificRL) {
    const extraRL = nrSpecificRL - nrSpecRLNeeded;
    for (let i = 0; i < extraRL && i < existingRL.length; i++) {
      const fileThread = threads.find(
        (thread) => thread.file_type === existingRL[i]?.file_type
      );
      delta.remove.push({
        studentId,
        programId: program._id,
        fileThread
      });
    }
  }

  return delta;
};
const findStudentDelta = async (studentId, program) => {
  let delta = {
    add: [],
    remove: []
  };

  const studentProgramThreads = await Documentthread.find({
    student_id: studentId,
    program_id: program._id
  })
    .select('file_type messages')
    .lean();

  studentProgramThreads.map((thread) => {
    thread.messageSize = thread.messages.length;
    delete thread.messages;
  });

  for (let fileType of Object.keys(FILETYPES)) {
    if (FILETYPES[fileType] === 'RL') {
      continue;
    }
    const fileThread = studentProgramThreads.find(
      (thread) => thread.file_type === FILETYPES[fileType]
    );

    if (program[fileType]?.toLowerCase() === 'yes' && !fileThread) {
      delta.add.push({
        studentId,
        programId: program._id,
        fileType: FILETYPES[fileType]
      });
    } else if (program[fileType]?.toLowerCase() !== 'yes' && fileThread) {
      delta.remove.push({
        studentId,
        programId: program._id,
        fileThread
      });
    }
  }

  const RLdelta = await findRLDelta(program, studentId, studentProgramThreads);
  delta.add = delta.add.concat(RLdelta.add);
  delta.remove = delta.remove.concat(RLdelta.remove);
  return delta;
};

const handleStudentDelta = async (studentId, program) => {
  const studentDelta = await findStudentDelta(studentId, program);

  for (let missingDoc of studentDelta.add) {
    try {
      await createApplicationThread(
        missingDoc.studentId.toString(),
        missingDoc.programId.toString(),
        missingDoc.fileType
      );
      logger.info(
        `handleStudentDelta: create thread for student ${missingDoc.studentId} and program ${missingDoc.programId} with file type ${missingDoc.fileType}`
      );
    } catch (error) {
      logger.error(
        `handleStudentDelta: error on thread creation for student ${missingDoc.studentId} and program ${missingDoc.programId} with file type ${missingDoc.fileType} -> error: ${error}`
      );
    }
  }
  for (let extraDoc of studentDelta.remove) {
    if (extraDoc?.fileThread?.messageSize !== 0) {
      logger.info(
        `handleStudentDelta: thread deletion aborted (non-empty thread) for student ${studentId} and program ${program._id} with file type ${extraDoc.fileThread.fileType} -> messages exist`
      );
      continue;
    }
    try {
      await deleteApplicationThread(
        extraDoc.studentId.toString(),
        extraDoc.programId.toString(),
        extraDoc.fileThread._id.toString()
      );
      logger.info(
        `handleStudentDelta: delete thread for student ${extraDoc.studentId} and program ${extraDoc.programId} with file type ${extraDoc.fileThread.file_type}`
      );
    } catch (error) {
      logger.error(
        `handleStudentDelta: error on thread deletion for student ${extraDoc.studentId} and program ${extraDoc.programId} with file type ${extraDoc.fileThread.file_type} -> error: ${error}`
      );
    }
  }
};

const handleThreadDelta = async (program) => {
  const affectedStudents = await findAffectedStudents(program._id);
  for (let studentId of affectedStudents) {
    try {
      await handleStudentDelta(studentId, program);
    } catch (error) {
      logger.error(
        `handleThreadDelta: error on student ${studentId} and program ${program._id}: ${error}`
      );
    }
  }
};

const handleProgramChanges = (schema) => {
  schema.pre(
    ['findOneAndUpdate', 'updateOne', 'updateMany', 'update'],
    async function (doc) {
      try {
        const condition = this.getQuery();
        this._originals = await this.model.find(condition).lean();
      } catch (error) {
        logger.error(`ProgramHook - Error on pre hook: ${error}`);
      }
    }
  );

  schema.post(
    ['findOneAndUpdate', 'updateOne', 'updateMany', 'update'],
    async function (doc) {
      try {
        const docs = this._originals;
        delete this._originals;
        const changes = this.getUpdate().$set;
        if (!isCrucialChanges(changes) || docs?.length === 0) {
          return;
        }

        for (let doc of docs) {
          const updatedDoc = { ...doc, ...changes };
          const programId = updatedDoc._id;

          try {
            logger.info(
              `ProgramHook - Crucial changes detected on Program (Id=${programId}): ${JSON.stringify(
                changes
              )}`
            );
            await handleThreadDelta(updatedDoc);
            logger.info(
              `ProgramHook - Post hook executed successfully. (Id=${programId})`
            );
          } catch (error) {
            logger.error(
              `ProgramHook - Error on post hook (Id=${programId}): ${error}`
            );
          }
        }
      } catch (error) {
        logger.error(`ProgramHook - Error on post hook: ${error}`);
      }
    }
  );
};

module.exports = {
  handleProgramChanges,
  isCrucialChanges,
  findAffectedStudents,
  findStudentDelta,
  handleThreadDelta
};
