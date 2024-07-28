const _ = require('lodash');
const { ErrorResponse } = require('../common/errors');
const path = require('path');

const { asyncHandler } = require('../middlewares/error-handler');
const logger = require('../services/logger');
const Internaldoc = require('../models/Internaldoc');

const getQueryPublicResults = asyncHandler(async (req, res, next) => {
  const documentations = await req.db
    .model('Documentation')
    .find(
      {
        $text: { $search: req.query.q },
        category: { $not: { $regex: new RegExp('portal-instruction', 'i') } }
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5)
    .select('title')
    .lean();

  // TODO: use case define:

  // TODO: search for student
  // search thread, cv ml rl, public doc,

  res.status(200).send({
    success: true,
    data: documentations.sort((a, b) => b.score - a.score)
  });
});

const getQueryResults = asyncHandler(async (req, res, next) => {
  //   const searchTerms = req.query.q.split(' ').filter(Boolean);

  //   const regex = new RegExp(searchTerms.join('|'), 'i');

  // Use the regular expression pattern in the query
  const students = await req.db
    .model('User')
    .find(
      {
        $text: { $search: req.query.q },
        role: { $in: ['Student', 'Guest', 'Agent', 'Editor'] }
      },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5)
    .select('firstname lastname firstname_chinese lastname_chinese role')
    .lean();

  const documentations = await req.db
    .model('Documentation')
    .find(
      { $text: { $search: req.query.q } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5)
    .select('title')
    .lean();

  const internaldocs = await Internaldoc.find(
    { $text: { $search: req.query.q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5)
    .select('title internal')
    .lean();

  const programs = await req.db
    .model('Program')
    .find(
      { $text: { $search: req.query.q }, isArchiv: { $ne: true } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(5)
    .select('school program_name degree semester')
    .lean();
  // TODO: use case define:

  // TODO: search for student
  // search thread, cv ml rl, public doc,

  res.status(200).send({
    success: true,
    data: students
      .concat(documentations, internaldocs, programs)
      .sort((a, b) => b.score - a.score)
  });
});

const getQueryStudentsResults = asyncHandler(async (req, res, next) => {
  const students = await req.db
    .model('User')
    .find({
      $and: [
        {
          $or: [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { firstname_chinese: { $regex: req.query.q, $options: 'i' } },
            { lastname_chinese: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } }
          ]
        },
        { role: { $in: ['Student'] } }
      ]
    })
    .limit(6)
    .select('firstname lastname firstname_chinese lastname_chinese role email')
    .lean();

  res.status(200).send({
    success: true,
    data: students.sort((a, b) => b.score - a.score)
  });
});

module.exports = {
  getQueryStudentsResults,
  getQueryPublicResults,
  getQueryResults
};
