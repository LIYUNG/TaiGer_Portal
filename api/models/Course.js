const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');
const coursesSchema = new mongoose.Schema({
  student_id: { type: ObjectId, ref: 'User' },
  name: { type: String, default: '' },
  table_data_string: { type: String, default: '' },
  updatedAt: Date
});
const Course = mongoose.model('Course', coursesSchema);
module.exports = Course;
