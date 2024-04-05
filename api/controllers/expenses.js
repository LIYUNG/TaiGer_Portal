const { ErrorResponse } = require('../common/errors');
const { asyncHandler } = require('../middlewares/error-handler');
const Expense = require('../models/Expense');
const { User, Student } = require('../models/User');
const logger = require('../services/logger');
const async = require('async');

const getExpenses = asyncHandler(async (req, res) => {
  const studentsWithExpenses = await Student.aggregate([
    { $match: { role: { $in: ['Admin', 'Agent', 'Editor'] } } },
    {
      $lookup: {
        from: 'expenses',
        localField: '_id',
        foreignField: 'student_id',
        as: 'expenses'
      }
    }
  ]);
  res.status(200).send({ success: true, data: studentsWithExpenses });
});

const getExpense = asyncHandler(async (req, res) => {
  const { taiger_user_id } = req.params;
  const the_user = await User.findById(taiger_user_id).select(
    'firstname lastname role'
  );

  if (
    the_user.role !== 'Admin' &&
    the_user.role !== 'Agent' &&
    the_user.role !== 'Editor'
  ) {
    logger.error('getExpense: not TaiGer user!');
    throw new ErrorResponse(401, 'Invalid TaiGer user');
  }
  const studentsWithExpenses = await Student.aggregate([
    {
      $lookup: {
        from: 'expenses',
        localField: '_id',
        foreignField: 'student_id',
        as: 'expenses'
      }
    }
  ]);
  // res.status(200).send({ success: true, data: expense });

  // query by agents field: student.agents include agent_id
  if (the_user.role === 'Agent') {
    const students = await Student.find({
      agents: the_user._id.toString(),
      archiv: { $ne: true }
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification')
      .lean();
    // Merge the results
    const mergedResults = students.map((student) => {
      const aggregateData = studentsWithExpenses.find(
        (item) => item._id.toString() === student._id.toString()
      );
      return { ...aggregateData, ...student };
    });
    res
      .status(200)
      .send({ success: true, data: { students: mergedResults, the_user } });
  } else if (the_user.role === 'Editor') {
    const students = await Student.find({
      editors: the_user._id.toString(),
      archiv: { $ne: true }
    })
      .populate('agents editors', 'firstname lastname email')
      .populate('applications.programId')
      .populate(
        'generaldocs_threads.doc_thread_id applications.doc_modification_thread.doc_thread_id',
        '-messages'
      )
      .select('-notification')
      .lean();
    // Merge the results
    const mergedResults = students.map((student) => {
      const aggregateData = studentsWithExpenses.find(
        (item) => item._id.toString() === student._id.toString()
      );
      return { ...aggregateData, ...student };
    });
    res
      .status(200)
      .send({ success: true, data: { students: mergedResults, the_user } });
  } else {
    res.status(200).send({ success: true, data: { students: [], the_user } });
  }
});

const syncExpense = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).send({ success: true, data: users });
});

module.exports = {
  getExpenses,
  getExpense,
  syncExpense
};
