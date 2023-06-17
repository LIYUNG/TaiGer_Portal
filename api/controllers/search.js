const _ = require('lodash');
const { spawn } = require('child_process');
const aws = require('aws-sdk');

const { ErrorResponse } = require('../common/errors');
const path = require('path');

const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const { User } = require('../models/User');
const Documentation = require('../models/Documentation');

const getQueryResults = asyncHandler(async (req, res, next) => {
  const searchTerms = req.query.q.split(' ').filter(Boolean);

  const regex = new RegExp(searchTerms.join('|'), 'i');

  // Use the regular expression pattern in the query
  const students = await User.find(
    { $text: { $search: req.query.q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .select('firstname lastname role');

  const documentations = await Documentation.find(
    { $text: { $search: req.query.q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .select('title');

  // TODO: use case define:
  // firstname
  // documentation search
  // lastname
  // TODO limit return length

  //   console.log(students);
  res
    .status(200)
    .send({ success: true, data: students.concat(documentations) });
});

module.exports = {
  getQueryResults
};
