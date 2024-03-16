const { model, Schema } = require('mongoose');
const logger = require('../services/logger');
const {
  findAffectedStudents,
  isCrucialChanges,
  handleMissingThreads
} = require('../utils/modelHelper/programChange');

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

const programModule = {
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
  gpa_requirement: {
    type: String
  },
  application_start: String,
  application_deadline: {
    type: String
  },
  uni_assist: {
    type: String
  },
  toefl: {
    type: String
  },
  toefl_reading: {
    type: Number
  },
  toefl_listening: {
    type: Number
  },
  toefl_writing: {
    type: Number
  },
  toefl_speaking: {
    type: Number
  },
  ielts: {
    type: String
  },
  ielts_reading: {
    type: Number
  },
  ielts_listening: {
    type: Number
  },
  ielts_writing: {
    type: Number
  },
  ielts_speaking: {
    type: Number
  },
  testdaf: {
    type: String
  },
  basic_german_requirement: {
    type: String
  },
  gre: {
    type: String
  },
  gre_verbal: {
    type: Number
  },
  gre_quantitative: {
    type: Number
  },
  gre_analytical_writing: {
    type: Number
  },
  gmat: {
    type: String
  },
  ml_required: {
    type: String
  },
  ml_requirements: {
    type: String
  },
  rl_required: {
    type: String
  },
  rl_requirements: {
    type: String
  },
  is_rl_specific: {
    type: Boolean
  },
  essay_required: {
    type: String
  },
  essay_requirements: {
    type: String
  },
  portfolio_required: {
    type: String
  },
  portfolio_requirements: {
    type: String
  },
  supplementary_form_required: {
    type: String
  },
  supplementary_form_requirements: {
    type: String
  },
  ects_requirements: {
    type: String
  },
  special_notes: {
    type: String
  },
  comments: {
    type: String
  },
  application_portal_a: {
    type: String
  },
  application_portal_b: {
    type: String
  },
  application_portal_a_instructions: {
    type: String
  },
  application_portal_b_instructions: {
    type: String
  },
  uni_assist_link: {
    type: String
  },
  website: {
    type: String
  },
  fpso: {
    type: String
  },
  updatedAt: Date,
  whoupdated: {
    type: String
  },
  tuition_fees: {
    type: String
  },
  study_group_flag: {
    type: String
  },
  contact: {
    type: String
  },
  country: {
    type: String
  },
  requiredDocuments: [String], // Not used
  optionalDocuments: [String], // not used
  url: String
};

const programSchema = new Schema(programModule, { timestamps: true });
programSchema.pre(['updateOne', 'updateMany', 'update'], async function () {
  try {
    const condition = this.getQuery();
    this._originals = await this.model.find(condition).lean();
  } catch (error) {
    logger.error(`ProgramHook - Error on pre hook: ${error}`);
  }
});

programSchema.post(['updateOne', 'updateMany', 'update'], async function () {
  try {
    const docs = this._originals;
    delete this._originals;
    const changes = this.getUpdate().$set;
    if (!isCrucialChanges(changes)) {
      return;
    }

    for (let doc of docs) {
      const programId = doc._id;
      logger.info(
        `ProgramHook - Crucial changes detected on Program (Id=${programId}): ${JSON.stringify(
          changes
        )}`
      );
      const studentThreadsMap = await findAffectedStudents(programId);
      await handleMissingThreads(doc, studentThreadsMap);
      logger.info(
        `ProgramHook - Post hook executed successfully. (Id=${programId})`
      );
    }
  } catch (error) {
    logger.error(`ProgramHook - Error on post hook: ${error}`);
  }
});

programSchema.index({ school: 'text', program_name: 'text' });
const Program = model('Program', programSchema);
module.exports = {
  programModule,
  Degree,
  Program
};
