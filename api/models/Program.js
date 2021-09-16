const mongoose = require("mongoose");

const Degree = {
  bachelor: "bachelor",
  master: "master",
  doctoral: "doctoral",
};

const programSchema = new mongoose.Schema(
  {
    // TODO: school might want it's own schema
    school: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    url: String,
    degree: {
      type: String,
      required: true,
      enum: Object.values(Degree),
    },
    semester: String, // TODO: enum?
    applicationAvailable: Date,
    applicationDeadline: {
      type: Date,
      required: true,
    },
    requiredDocuments: [String],
    optionalDocuments: [String],
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);

module.exports = {
  Degree,
  Program,
};
