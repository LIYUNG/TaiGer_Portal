const {
  model,
  Schema,
  Types: { ObjectId },
} = require("mongoose");
const mongoose = require("mongoose");
const documentthreadsSchema = new mongoose.Schema({
  student_id: { type: ObjectId, ref: "User" },
  file_type: { type: String, ref: "User" },
  application_id: { type: ObjectId, ref: "Program" },
  messages: [
    {
      user_id: {
        type: String,
        default: "",
      },
      message: {
        type: String,
        default: "",
      },
      file: [
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
    },
  ],
  updatedAt: Date,
});
const Documentthread = mongoose.model(
  "Documentthread",
  documentthreadsSchema
);
module.exports = {
  Documentthread,
};
