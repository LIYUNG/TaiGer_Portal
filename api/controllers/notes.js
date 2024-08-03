const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const async = require('async');

const getStudentNotes = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const notes = await req.db.model('Note').findOne({ student_id });
  res.status(200).send({ success: true, data: notes });
});

const updateStudentNotes = asyncHandler(async (req, res) => {
  const fields = req.body;
  fields.student_id = req.params.student_id;
  const users = await req.db
    .model('Note')
    .findOneAndUpdate({ student_id: req.params.student_id }, fields, {
      upsert: true,
      new: true
    });
  res.status(200).send({ success: true, data: users });
});

module.exports = {
  getStudentNotes,
  updateStudentNotes
};
