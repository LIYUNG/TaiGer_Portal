const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');

// Function to get distinct school names
const DistinctProgramsAndKeywordSets = async (req) => {
  try {
    const distinctProgramsPromise = req.db.model('Program').aggregate([
      {
        $group: {
          _id: {
            school: '$school',
            program_name: '$program_name',
            degree: '$degree'
          }
        }
      },
      {
        $project: {
          _id: 0,
          school: '$_id.school',
          program_name: '$_id.program_name',
          degree: '$_id.degree'
        }
      },
      {
        $sort: { school: 1 }
      }
    ]);

    const keywordsetsPromise = await req.db
      .model('KeywordSet')
      .find({})
      .sort({ createdAt: -1 });
    const [distinctPrograms, keywordsets] = await Promise.all([
      distinctProgramsPromise,
      keywordsetsPromise
    ]);

    return { distinctPrograms, keywordsets };
  } catch (error) {
    logger.error('Error fetching distinct programs and keyword sets:', error);
    throw error;
  }
};

const getDistinctProgramsAndKeywordSets = async (req, res) => {
  try {
    const { distinctPrograms, keywordsets } =
      await DistinctProgramsAndKeywordSets(req);
    res.send({ success: true, data: { distinctPrograms, keywordsets } });
  } catch (error) {
    logger.error('Error fetching distinct schools:', error);
    throw error;
  }
};

const getProgramRequirements = asyncHandler(async (req, res) => {
  const programRequirements = await req.db
    .model('ProgramRequirement')
    .find({})
    .populate('programId program_categories.keywordSets')
    .sort({ createdAt: -1 });
  res.send({ success: true, data: programRequirements });
});

const getProgramRequirement = asyncHandler(async (req, res) => {
  const { requirementId } = req.params;
  const { distinctPrograms, keywordsets } =
    await DistinctProgramsAndKeywordSets(req);
  const requirement = await req.db
    .model('ProgramRequirement')
    .findById(requirementId)
    .populate('programId', 'school program_name degree')
    .populate('program_categories.keywordSets')
    .lean();
  if (!requirement) {
    logger.error('getProgramRequirement: Invalid program id');
    throw new ErrorResponse(404, 'ProgramRequirement not found');
  }
  res.send({
    success: true,
    data: { requirement, distinctPrograms, keywordsets }
  });
});

const createProgramRequirement = asyncHandler(async (req, res) => {
  const fields = req.body;
  const program = fields?.program;
  const program_categories = fields?.program_categories.map(
    (program_category) => ({
      ...program_category,
      keywordSets: program_category.keywordSets?.map(
        (keywordSet) => keywordSet._id
      )
    })
  );
  const matchedPrograms = await req.db
    .model('Program')
    .find({
      school: program.school,
      program_name: program.program_name,
      degree: program.degree
    })
    .lean();
  const matchedProgramIds = matchedPrograms.map(
    (matchedProgram) => matchedProgram._id
  );
  const existedProgramRequirement = await req.db
    .model('ProgramRequirement')
    .find({ programId: matchedProgramIds })
    .lean();
  if (existedProgramRequirement?.length > 0) {
    logger.error(
      'createProgramRequirement: program analysis is already existed!'
    );
    throw new ErrorResponse(
      423,
      'createProgramRequirement: program analysis is already existed!'
    );
  }
  const payload = {
    programId: [...matchedPrograms.map((matchedProgram) => matchedProgram._id)],
    ...fields,
    program_categories
  };
  logger.info(JSON.stringify(payload));
  const newProgramRequirement = await req.db
    .model('ProgramRequirement')
    .create(payload);

  res.status(201).send({
    success: true,
    data: newProgramRequirement
  });

  // TODO: update Program Collection program analysis?
});

const updateProgramRequirement = asyncHandler(async (req, res) => {
  const { requirementId } = req.params;
  const fields = req.body;

  fields.updatedAt = new Date();
  delete fields.program;
  if (fields?.program_categories) {
    fields.coursesScore = fields?.program_categories
      ?.map((program_category) => program_category.maxScore)
      ?.reduce((sum, current) => sum + current, 0);
  }

  const updatedProgramRequirement = await req.db
    .model('ProgramRequirement')
    .findByIdAndUpdate(requirementId, fields, {
      upsert: false,
      new: true
    })
    .lean();

  if (!updatedProgramRequirement) {
    logger.error('updateProgramRequirement: requirementId');
    throw new ErrorResponse(404, 'Program requirement not found');
  }

  res.status(200).send({ success: true, data: updatedProgramRequirement });
});

const deleteProgramRequirement = asyncHandler(async (req, res) => {
  const { requirementId } = req.params;
  await req.db.model('ProgramRequirement').findByIdAndDelete(requirementId);

  res.status(200).send({ success: true });
});

module.exports = {
  getDistinctProgramsAndKeywordSets,
  getProgramRequirements,
  getProgramRequirement,
  createProgramRequirement,
  updateProgramRequirement,
  deleteProgramRequirement
};
