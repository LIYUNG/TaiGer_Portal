const mongoose = require("mongoose");

const Degree = {
  bachelor: "bachelor",
  master: "master",
  doctoral: "doctoral",
};
const Languages = {
  english: "English",
  german: "German",
  denglish: "GermanAndEnglish",
};
const programSchema = new mongoose.Schema(
  {
    // TODO: school might want it's own schema
    school: {
      type: String,
      required: true,
    },
    prorgam: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      enum: Object.values(Degree),
    },
    semester: String, // TODO: enum?
    language: {
      type: String,
      enum: Object.values(Languages),
    },
    application_start: Date,
    application_deadline: {
      type: Date,
      // required: true,
    },
    uni_assist: {
      type: String,
      // required: true,
    },
    toefl: {
      type: String,
      // required: true,
    },
    ielts: {
      type: String,
      // required: true,
    },
    testdaf: {
      type: String,
      // required: true,
    },
    gre: {
      type: String,
      // required: true,
    },
    gmat: {
      type: String,
      // required: true,
    },
    ml_required: {
      type: String,
      // required: true,
    },
    ml_requirements: {
      type: String,
      // required: true,
    },
    rl_required: {
      type: String,
      // required: true,
    },
    rl_requirements: {
      type: String,
      // required: true,
    },
    essay_required: {
      type: String,
      // required: true,
    },
    essay_requirements: {
      type: String,
      // required: true,
    },
    special_notes: {
      type: String,
      // required: true,
    },
    comments: {
      type: String,
      // required: true,
    },
    application_portal_a: {
      type: String,
      // required: true,
    },
    application_portal_b: {
      type: String,
      // required: true,
    },
    uni_assist_link: {
      type: String,
      // required: true,
    },
    website: {
      type: String,
      // required: true,
    },
    fpso: {
      type: String,
      // required: true,
    },
    updatedAt: Date,
    whoupdated: {
      type: String,
      // required: true,
    },
    study_group_flag: {
      type: String,
      // required: true,
    },
    requiredDocuments: [String],
    optionalDocuments: [String],
    url: String,
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", programSchema);

module.exports = {
  Degree,
  Program,
};
