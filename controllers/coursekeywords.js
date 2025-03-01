const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');

const getKeywordSets = asyncHandler(async (req, res) => {
  const keywordsets = await req.db
    .model('KeywordSet')
    .find({})
    .sort({ createdAt: -1 });
  res.send({ success: true, data: keywordsets });
});

const getKeywordSet = asyncHandler(async (req, res) => {
  const { keywordsSetId } = req.params;

  const keywordsSet = await req.db.model('KeywordSet').findById(keywordsSetId);
  if (!keywordsSet) {
    logger.error('getKeywordSet: Invalid keywordsSet id');
    throw new ErrorResponse(404, 'KeywordSet not found');
  }
  res.send({ success: true, data: keywordsSet });
});

const createKeywordSet = asyncHandler(async (req, res) => {
  const fields = req.body;
  const query = {
    $or: [
      {
        $and: [
          { 'keywords.zh': { $in: fields.keywords.zh } },
          { 'antiKeywords.zh': { $in: fields.antiKeywords.zh } }
        ]
      },
      {
        $and: [
          { 'keywords.en': { $in: fields.keywords.en } },
          { 'antiKeywords.en': { $in: fields.antiKeywords.en } }
        ]
      }
    ]
  };
  const existed = await req.db.model('KeywordSet').findOne(query);
  if (existed) {
    // Find out which specific keywords and antiKeywords are duplicates
    const duplicateKeywordsZh = fields.keywords.zh.filter((keyword) =>
      existed.keywords.zh.includes(keyword)
    );
    const duplicateAntiKeywordsZh = fields.antiKeywords.zh.filter(
      (antiKeyword) => existed.antiKeywords.zh.includes(antiKeyword)
    );
    const duplicateKeywordsEn = fields.keywords.en.filter((keyword) =>
      existed.keywords.en.includes(keyword)
    );
    const duplicateAntiKeywordsEn = fields.antiKeywords.en.filter(
      (antiKeyword) => existed.antiKeywords.en.includes(antiKeyword)
    );
    // Build a clear error message
    const duplicateZH = {
      keywords: duplicateKeywordsZh,
      antiKeywords: duplicateAntiKeywordsZh
    };
    const duplicateEN = {
      keywords: duplicateKeywordsEn,
      antiKeywords: duplicateAntiKeywordsEn
    };

    logger.error('createKeywordSet: Duplicate Keyword set found:', fields);
    throw new ErrorResponse(
      423,
      `Duplicate Keywordset found: ZH ${JSON.stringify(
        duplicateZH
      )}, Anti-Keywordset found: EN ${JSON.stringify(duplicateEN)}`
    );
  }
  const newKeywordSet = await req.db.model('KeywordSet').create(fields);

  res.status(201).send({ success: true, data: newKeywordSet });
});

const updateKeywordSet = asyncHandler(async (req, res) => {
  const { keywordsSetId } = req.params;
  const fields = req.body;

  delete fields._id;
  fields.updatedAt = new Date();
  const updatedKeywordSet = await req.db
    .model('KeywordSet')
    .findByIdAndUpdate(keywordsSetId, fields, {
      new: true
    });

  if (!updatedKeywordSet) {
    logger.error('updateKeywordSet: Invalid keyword set id');
    throw new ErrorResponse(404, 'Keyword set not found');
  }

  res.status(200).send({ success: true, data: updatedKeywordSet });
});

// will also remove the keywordId from the programs who has keywordsetid in one of their requirement
const deleteKeywordSet = asyncHandler(async (req, res) => {
  const { keywordsSetId } = req.params;
  // Start a session for the transaction
  const session = await req.db.startSession();
  session.startTransaction();
  try {
    await req.db.model('KeywordSet').findByIdAndDelete(keywordsSetId);
    await req.db.model('ProgramRequirement').updateMany(
      { 'program_categories.keywordSets': keywordsSetId },
      {
        $pull: {
          'program_categories.$[].keywordSets': keywordsSetId
        }
      }
    );
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    // If any operation fails, abort the transaction
    await session.abortTransaction();
    await session.endSession();
    logger.error('Failed to delete keywordsSetId ', error);
    throw error;
  }
  res.status(200).send({ success: true });
});

module.exports = {
  getKeywordSets,
  getKeywordSet,
  createKeywordSet,
  updateKeywordSet,
  deleteKeywordSet
};
