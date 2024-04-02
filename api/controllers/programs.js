const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Program } = require('../models/Program');
const { Role, Student } = require('../models/User');
const logger = require('../services/logger');
const { one_month_cache } = require('../cache/node-cache');
const { two_weeks_cache } = require('../cache/node-cache');
const { PROGRAMS_CACHE } = require('../config');
const Ticket = require('../models/Ticket');

const getPrograms = asyncHandler(async (req, res) => {
  // Option 1 : Cache version
  if (PROGRAMS_CACHE === 'true') {
    const value = two_weeks_cache.get(req.originalUrl);
    if (value === undefined) {
      // cache miss
      const programs = await Program.find({ isArchiv: { $ne: true } }).select(
        '-study_group_flag -tuition_fees -website -special_notes -comments -optionalDocuments -requiredDocuments -uni_assist -daad_link -ml_required -ml_requirements -rl_required -essay_required -essay_requirements -application_portal_a -application_portal_b -fpso -program_duration -deprecated'
      );
      const success = two_weeks_cache.set(req.originalUrl, programs);
      if (success) {
        console.log('programs cache set successfully');
      }
      return res.send({ success: true, data: programs });
    }
    res.send({ success: true, data: value });
  } else {
    // Option 2: No cache, good when programs are still frequently updated
    const programs = await Program.find({ isArchiv: { $ne: true } }).select(
      '-study_group_flag -tuition_fees -website -special_notes -comments -optionalDocuments -requiredDocuments -uni_assist -daad_link -ml_required -ml_requirements -rl_required -essay_required -essay_requirements -application_portal_a -application_portal_b -fpso -program_duration -deprecated'
    );
    res.send({ success: true, data: programs });
  }
});

const getStudentsByProgram = async (programId) => {
  const students = await Student.find({
    applications: {
      $elemMatch: {
        programId: programId,
        decided: 'O'
      }
    }
  })
    .populate('agents editors', 'firstname')
    .populate('applications.doc_modification_thread.doc_thread_id', 'file_type')
    .select(
      'firstname lastname applications application_preference.expected_application_date'
    )
    .lean();

  if (!students) {
    return;
  }

  students.forEach((student) => {
    student.application = student.applications.find(
      (app) => app.programId.toString() === programId.toString()
    );
    delete student.applications;
  });

  return students;
};

const getProgram = asyncHandler(async (req, res) => {
  const { user } = req;
  // prevent student multitenancy
  if (user.role === Role.Student) {
    if (
      user.applications.findIndex(
        (app) => app.programId.toString() === req.params.programId
      ) === -1
    ) {
      logger.error('getProgram: Invalid program id in your applications');
      throw new ErrorResponse(403, 'Invalid program id in your applications');
    }
  }
  if (PROGRAMS_CACHE === 'true') {
    const value = one_month_cache.get(req.originalUrl);
    if (value === undefined) {
      // cache miss
      const program = await Program.findById(req.params.programId);
      if (!program) {
        logger.error('getProgram: Invalid program id');
        throw new ErrorResponse(403, 'Invalid program id');
      }
      const success = one_month_cache.set(req.originalUrl, program);
      if (success) {
        console.log('programs cache set successfully');
      }
      if (
        user.role === 'Admin' ||
        user.role === 'Agent' ||
        user.role === 'Editor'
      ) {
        const students = await Student.find({
          applications: {
            $elemMatch: {
              programId: req.params.programId,
              decided: 'O',
              closed: 'O'
            }
          }
        })
          .populate('agents editors', 'firstname')
          .select(
            'firstname lastname applications application_preference.expected_application_date'
          );

        return res.send({ success: true, data: program, students });
      }
      return res.send({ success: true, data: program });
    }
    console.log('programs cache hit');

    if (
      user.role === 'Admin' ||
      user.role === 'Agent' ||
      user.role === 'Editor'
    ) {
      const students = await Student.find({
        applications: {
          $elemMatch: {
            programId: req.params.programId,
            decided: 'O'
          }
        }
      })
        .populate('agents editors', 'firstname')
        .select(
          'firstname lastname applications application_preference.expected_application_date'
        );

      res.send({ success: true, data: value, students });
    } else {
      res.send({ success: true, data: value });
    }
  } else if (
    user.role === 'Admin' ||
    user.role === 'Agent' ||
    user.role === 'Editor'
  ) {
    const students = await getStudentsByProgram(req.params.programId);
    const program = await Program.findById(req.params.programId);
    if (!program) {
      logger.error('getProgram: Invalid program id');
      throw new ErrorResponse(403, 'Invalid program id');
    }
    res.send({ success: true, data: program, students });
  } else {
    const program = await Program.findById(req.params.programId);
    if (!program) {
      logger.error('getProgram: Invalid program id');
      throw new ErrorResponse(403, 'Invalid program id');
    }
    res.send({ success: true, data: program });
  }
});

const createProgram = asyncHandler(async (req, res) => {
  const { user } = req;
  const new_program = req.body;

  new_program.school = new_program.school.trim();
  new_program.program_name = new_program.program_name.trim();
  new_program.updatedAt = new Date();
  new_program.whoupdated = `${user.firstname} ${user.lastname}`;
  const programs = await Program.find({
    school: new_program.school,
    program_name: new_program.program_name,
    degree: new_program.degree,
    semester: new_program.semester
  });
  if (programs.length > 0) {
    logger.error('createProgram: same program existed!');
    throw new ErrorResponse(
      403,
      'This program is already existed! Considering update the existing one.'
    );
  }
  const program = await Program.create(new_program);
  return res.status(201).send({ success: true, data: program });
});

const updateProgram = asyncHandler(async (req, res) => {
  const { user } = req;
  const fields = req.body;

  fields.updatedAt = new Date();
  fields.whoupdated = `${user.firstname} ${user.lastname}`;
  const fields_root = { ...fields };
  delete fields_root._id;
  delete fields_root.semester;
  delete fields_root.application_start;
  delete fields_root.application_deadline;

  const program = await Program.findOneAndUpdate(
    { _id: req.params.programId },
    fields,
    {
      new: true
    }
  );

  // Update same program but other semester common data
  await Program.updateMany(
    {
      _id: { $ne: req.params.programId },
      school: program.school,
      program_name: program.program_name,
      degree: program.degree
    },
    fields_root
  );

  // Delete cache key for image, pdf, docs, file here.
  const value = one_month_cache.del(req.originalUrl);
  if (value === 1) {
    console.log('cache key deleted successfully due to update');
  }

  return res.status(200).send({ success: true, data: program });
});

const deleteProgram = asyncHandler(async (req, res) => {
  // All students including archived
  const students = await Student.find({
    applications: {
      $elemMatch: {
        programId: req.params.programId
      }
    }
  }).select('firstname lastname applications.programId');
  // Check if anyone applied this program
  if (students.length === 0) {
    console.log('it can be deleted!');
    await Program.findByIdAndUpdate(req.params.programId, { isArchiv: true });
    console.log('The program deleted!');

    const value = one_month_cache.del(req.originalUrl);
    if (value === 1) {
      console.log('cache key deleted successfully due to delete');
    }
  } else {
    console.log('it can not be deleted!');
    console.log('The following students have these programs!');
    console.log(students);
    // Make sure delete failed to user (Admin)
    logger.error('deleteProgram: some students have these programs');
    throw new ErrorResponse(423, 'This program can not be deleted!');
  }
  res.status(200).send({ success: true });
  if (students.length === 0) {
    await Ticket.deleteMany({ program_id: req.params.programId });
    console.log('Delete Tickets!');
  }
});

module.exports = {
  getStudentsByProgram,
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
};
