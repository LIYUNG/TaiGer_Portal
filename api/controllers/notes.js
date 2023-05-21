const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Note = require('../models/Note');
const { User, Student } = require('../models/User');
const async = require('async');

const getStudentNotes = asyncHandler(async (req, res) => {
  const { student_id } = req.params;
  const notes = await Note.findOne({ student_id });
  res.status(200).send({ success: true, data: notes });
});

const updateStudentNotes = asyncHandler(async (req, res) => {
  const fields = req.body;
  fields.student_id = req.params.student_id;
  const users = await Note.findOneAndUpdate(
    { student_id: req.params.student_id },
    fields,
    {
      upsert: true,
      new: true
    }
  );
  res.status(200).send({ success: true, data: users });
});

module.exports = {
  getStudentNotes,
  updateStudentNotes
};
