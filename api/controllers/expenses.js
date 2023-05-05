const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Expense = require('../models/Expense');
const { User, Student } = require('../models/User');
const async = require('async');

const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Student.aggregate([
    {
      $lookup: {
        from: 'expenses',
        localField: '_id',
        foreignField: 'student_id',
        as: 'expenses'
      }
    }
  ]);
  res.status(200).send({ success: true, data: expenses });
});

const syncExpense = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).send({ success: true, data: users });
});

module.exports = {
  getExpenses,
  syncExpense
};
