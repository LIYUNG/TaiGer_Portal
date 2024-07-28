const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const notesSchema = new Schema({
  student_id: { type: ObjectId, ref: 'User' },
  notes: { type: String, default: '' },
  updatedAt: Date
});
const Note = model('Note', notesSchema);
module.exports = { Note, notesSchema };
