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
  const { ticketId } = req.params;

  const ticket = await req.db
    .model('KeywordSet')
    .findById(ticketId)
    .populate('messages.user_id', 'firstname lastname email')
    .populate('requester_id', 'firstname lastname email ');
  if (!ticket) {
    logger.error('getKeywordSet: Invalid ticket id');
    throw new ErrorResponse(404, 'KeywordSet not found');
  }
  res.send({ success: true, data: ticket });
});

const createKeywordSet = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticket } = req.body;
  ticket.requester_id = user._id.toString();
  // TODO: DO not create the same
  const new_ticket = await req.db.model('KeywordSet').create(ticket);

  res.status(201).send({ success: true, data: new_ticket });
});

const updateKeywordSet = asyncHandler(async (req, res) => {
  const { user } = req;
  const { ticketId } = req.params;
  const fields = req.body;

  fields.updatedAt = new Date();
  // TODO: update resolver_id
  const updatedKeywordSet = await req.db
    .model('KeywordSet')
    .findByIdAndUpdate(ticketId, fields, {
      new: true
    })
    .populate('requester_id', 'firstname lastname email archiv');

  if (!updatedKeywordSet) {
    logger.error('updateKeywordSet: Invalid message thread id');
    throw new ErrorResponse(404, 'Thread not found');
  }

  res.status(200).send({ success: true, data: updatedKeywordSet });
});

const deleteKeywordSet = asyncHandler(async (req, res) => {
  const { ticketId } = req.params;
  await req.db.model('KeywordSet').findByIdAndDelete(ticketId);

  res.status(200).send({ success: true });
});

module.exports = {
  getKeywordSets,
  getKeywordSet,
  createKeywordSet,
  updateKeywordSet,
  deleteKeywordSet
};
