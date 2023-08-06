const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');

const Degree = {
  bachelor_sc: 'B.Sc',
  bachelor_eng: 'B.Eng',
  bachelor_a: 'B.A',
  master_sc: 'M.Sc',
  master_a: 'M.A',
  mba: 'MBA',
  doctoral: 'PhD'
};
const Languages = {
  english: 'English',
  german: 'German',
  denglish: 'GermanAndEnglish'
};
const programSchema = new Schema(
  {
    school: {
      type: String,
      default: ''
    },
    program_name: {
      type: String,
      default: ''
    },
    degree: {
      type: String
      // enum: Object.values(Degree),
    },
    semester: String, // TODO: enum?
    lang: {
      type: String
      // enum: Object.values(Languages)
    },
    application_start: String,
    application_deadline: {
      type: String
      // required: true,
    },
    uni_assist: {
      type: String
      // required: true,
    },
    toefl: {
      type: String
      // required: true,
    },
    ielts: {
      type: String
      // required: true,
    },
    testdaf: {
      type: String
      // required: true,
    },
    gre: {
      type: String
      // required: true,
    },
    gmat: {
      type: String
      // required: true,
    },
    ml_required: {
      type: String
      // required: true,
    },
    ml_requirements: {
      type: String
      // required: true,
    },
    rl_required: {
      type: String
      // required: true,
    },
    rl_requirements: {
      type: String
      // required: true,
    },
    essay_required: {
      type: String
      // required: true,
    },
    essay_requirements: {
      type: String
      // required: true,
    },
    portfolio_required: {
      type: String
      // required: true,
    },
    portfolio_requirements: {
      type: String
      // required: true,
    },
    supplementary_form_required: {
      type: String
      // required: true,
    },
    supplementary_form_requirements: {
      type: String
      // required: true,
    },
    special_notes: {
      type: String
      // required: true,
    },
    comments: {
      type: String
      // required: true,
    },
    application_portal_a: {
      type: String
      // required: true,
    },
    application_portal_b: {
      type: String
      // required: true,
    },
    application_portal_a_instructions: {
      type: String
      // required: true,
    },
    application_portal_b_instructions: {
      type: String
      // required: true,
    },
    uni_assist_link: {
      type: String
      // required: true,
    },
    website: {
      type: String
      // required: true,
    },
    fpso: {
      type: String
      // required: true,
    },
    updatedAt: Date,
    whoupdated: {
      type: String
      // required: true,
    },
    tuition_fees: {
      type: String
      // required: true,
    },
    study_group_flag: {
      type: String
      // required: true,
    },
    country: {
      type: String
      // required: true,
    },
    requiredDocuments: [String], // Not used
    optionalDocuments: [String], // not used
    url: String
  },
  { timestamps: true }
);

programSchema.index({ school: 'text', program_name: 'text' });

const Program = model('Program', programSchema);

module.exports = {
  Degree,
  Program
};
