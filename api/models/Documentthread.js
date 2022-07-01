const mongoose = require("mongoose");
const documentthreadsSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  files: [
    {
      name: {
        type: String,
        required: true,
      },
      path: {
        type: String,
        required: true,
      },
    },
  ],
  updatedAt: Date,
});
const Documentthreads = mongoose.model(
  "Documentthreads",
  documentthreadsSchema
);
module.exports = {
  Documentthreads,
};
