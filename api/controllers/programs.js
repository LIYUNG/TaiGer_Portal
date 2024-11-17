const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const { Role } = require('../constants');
const logger = require('../services/logger');
const { one_month_cache } = require('../cache/node-cache');
const { two_weeks_cache } = require('../cache/node-cache');
const { PROGRAMS_CACHE } = require('../config');

const getDistinctSchoolsAttributes = async (req, res) => {
  try {
    const distinctCombinations = await req.db.model('Program').aggregate([
      {
        $group: {
          _id: {
            school: '$school',
            isPrivateSchool: '$isPrivateSchool',
            isPartnerSchool: '$isPartnerSchool',
            schoolType: '$schoolType',
            country: '$country',
            tags: '$tags'
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          school: '$_id.school',
          isPrivateSchool: '$_id.isPrivateSchool',
          isPartnerSchool: '$_id.isPartnerSchool',
          schoolType: '$_id.schoolType',
          country: '$_id.country',
          tags: '$_id.tags',
          count: 1
        }
      },
      {
        $sort: { school: 1 }
      }
    ]);

    logger.info(
      'Distinct school and program combinations:',
      distinctCombinations
    );

    res.send({ success: true, data: distinctCombinations });
  } catch (error) {
    logger.error(
      'Error fetching distinct school and program combinations:',
      error
    );
    throw error;
  }
};

const updateBatchSchoolAttributes = async (req, res) => {
  const fields = req.body;
  logger.info('Distinct schools:', fields);
  try {
    const schools = await req.db.model('Program').updateMany(
      {
        school: fields.school,
        $or: [
          { isPrivateSchool: { $ne: fields.isPrivateSchool } },
          { schoolType: { $ne: fields.schoolType } },
          { tags: { $ne: fields.tags } },
          { country: { $ne: fields.country } }
        ]
      },
      {
        $set: {
          isPrivateSchool: fields.isPrivateSchool,
          schoolType: fields.schoolType,
          tags: fields.tags,
          country: fields.country
        }
      },
      { upsert: false }
    );
    logger.info('Update school:', schools);
    res.send({ success: true });
  } catch (error) {
    logger.error('Error fetching distinct schools:', error);
    throw error;
  }
};

const getPrograms = asyncHandler(async (req, res) => {
  // Option 1 : Cache version
  if (PROGRAMS_CACHE === 'true') {
    const value = two_weeks_cache.get(req.originalUrl);
    if (value === undefined) {
      // cache miss
      const programs = await req.db
        .model('Program')
        .find({ isArchiv: { $ne: true } })
        .select(
          '-study_group_flag -tuition_fees -website -special_notes -comments -optionalDocuments -requiredDocuments -uni_assist -daad_link -ml_required -ml_requirements -rl_required -essay_required -essay_requirements -application_portal_a -application_portal_b -fpso -program_duration -deprecated'
        );
      const success = two_weeks_cache.set(req.originalUrl, programs);
      if (success) {
        logger.info('programs cache set successfully');
      }
      return res.send({ success: true, data: programs });
    }
    res.send({ success: true, data: value });
  } else {
    // Option 2: No cache, good when programs are still frequently updated
    const programs = await req.db
      .model('Program')
      .find({ isArchiv: { $ne: true } })
      .select(
        '-study_group_flag -tuition_fees -website -special_notes -comments -optionalDocuments -requiredDocuments -uni_assist -daad_link -ml_required -ml_requirements -rl_required -essay_required -essay_requirements -application_portal_a -application_portal_b -fpso -program_duration -deprecated'
      );
    res.send({ success: true, data: programs });
  }
});

const getStudentsByProgram = asyncHandler(async (req, programId) => {
  const students = await req.db
    .model('Student')
    .find({
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
});

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
      const program = await req.db
        .model('Program')
        .findById(req.params.programId);
      if (!program) {
        logger.error('getProgram: Invalid program id');
        throw new ErrorResponse(404, 'Program not found');
      }
      const success = one_month_cache.set(req.originalUrl, program);
      if (success) {
        logger.info('programs cache set successfully');
      }
      if (
        user.role === Role.Admin ||
        user.role === Role.Agent ||
        user.role === Role.Editor
      ) {
        const students = await req.db
          .model('Student')
          .find({
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

        const vc = await req.db
          .model('VC')
          .findOne({
            docId: req.params.programId,
            collectionName: 'Program'
          })
          .lean();

        return res.send({ success: true, data: program, students, vc });
      }
      return res.send({ success: true, data: program });
    }
    logger.info('programs cache hit');

    if (
      user.role === Role.Admin ||
      user.role === Role.Agent ||
      user.role === Role.Editor
    ) {
      const students = await req.db
        .model('Student')
        .find({
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

      const vc = await req.db
        .model('VC')
        .findOne({
          docId: req.params.programId,
          collectionName: 'Program'
        })
        .lean();
      res.send({ success: true, data: value, students, vc });
    } else {
      res.send({ success: true, data: value });
    }
  } else if (
    user.role === Role.Admin ||
    user.role === Role.Agent ||
    user.role === Role.Editor
  ) {
    const students = await getStudentsByProgram(req, req.params.programId);
    const program = await req.db
      .model('Program')
      .findById(req.params.programId);
    if (!program) {
      logger.error('getProgram: Invalid program id');
      throw new ErrorResponse(404, 'Program not found');
    }
    const vc = await req.db
      .model('VC')
      .findOne({
        docId: req.params.programId,
        collectionName: 'Program'
      })
      .lean();

    res.send({ success: true, data: program, students, vc });
  } else {
    const program = await req.db
      .model('Program')
      .findById(req.params.programId);
    if (!program) {
      logger.error('getProgram: Invalid program id');
      throw new ErrorResponse(404, 'Program not found');
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
  const programs = await req.db.model('Program').find({
    school: new_program.school,
    program_name: new_program.program_name,
    degree: new_program.degree,
    semester: new_program.semester,
    isArchiv: { $ne: true }
  });
  if (programs.length > 0) {
    logger.error('createProgram: same program existed!');
    throw new ErrorResponse(
      403,
      'This program is already existed! Considering update the existing one.'
    );
  }
  const program = await req.db.model('Program').create(new_program);
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

  const program = await req.db
    .model('Program')
    .findOneAndUpdate({ _id: req.params.programId }, fields, {
      new: true
    });

  // Update same program but other semester common data
  await req.db.model('Program').updateMany(
    {
      _id: { $ne: req.params.programId },
      school: program.school,
      program_name: program.program_name,
      degree: program.degree
    },
    fields_root
  );

  const vc = await req.db
    .model('VC')
    .findOne({
      docId: req.params.programId,
      collectionName: 'Program'
    })
    .lean();

  // Delete cache key for image, pdf, docs, file here.
  const value = one_month_cache.del(req.originalUrl);
  if (value === 1) {
    logger.info('cache key deleted successfully due to update');
  }

  return res.status(200).send({ success: true, data: program, vc });
});

const deleteProgram = asyncHandler(async (req, res) => {
  // All students including archived
  const students = await req.db
    .model('Student')
    .find({
      applications: {
        $elemMatch: {
          programId: req.params.programId
        }
      }
    })
    .select('firstname lastname applications.programId');
  // Check if anyone applied this program
  if (students.length === 0) {
    logger.info('it can be deleted!');

    await req.db
      .model('Program')
      .findByIdAndUpdate(req.params.programId, { isArchiv: true });
    logger.info('The program deleted!');

    const value = one_month_cache.del(req.originalUrl);
    if (value === 1) {
      logger.info('cache key deleted successfully due to delete');
    }
    // TODO:
    // Remove programId from programRequirement programId.
  } else {
    logger.error('it can not be deleted!');
    logger.error('The following students have these programs!');
    // Make sure delete failed to user (Admin)
    logger.error('deleteProgram: some students have these programs');
    throw new ErrorResponse(423, 'This program can not be deleted!');
  }
  res.status(200).send({ success: true });
  if (students.length === 0) {
    await req.db
      .model('Ticket')
      .deleteMany({ program_id: req.params.programId });
    logger.info('Delete Tickets!');
  }
});

module.exports = {
  getDistinctSchoolsAttributes,
  updateBatchSchoolAttributes,
  getStudentsByProgram,
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
};
