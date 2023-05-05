const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const accountingsSchema = new Schema({
  student_id: { type: ObjectId, ref: 'User' },
  income_type: { type: String, default: '' },
  amount: { type: String, default: '' },
  description: { type: String, default: '' },
  updatedAt: Date,
  expense: [
    {
      receiver_id: { type: ObjectId, ref: 'User' },
      path: { type: String, default: '' },
      income_type: { type: String, default: '' },
      isPaid: { type: Boolean, default: false },
      amount: { type: String, default: '' },
      updatedAt: Date
    }
  ]
});
const Expense = model('Expense', accountingsSchema);
module.exports = Expense;
