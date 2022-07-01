const {
  model,
  Schema,
  Types: { ObjectId },
} = require("mongoose");
const mongoose = require("mongoose");

const { DocumentStatus, CheckListStatus } = require("../constants");

const TaskSchema = new Schema({
  student_id: { type: ObjectId, ref: "User" },
  profile_documents: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  cvmlrl_documents: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  program_selection: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  program_decision: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  program_submission: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  cvmlrl_template: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  uni_assist_process: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  copies_certification: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  visa_progress: {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.Missing,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },

  others: [
    {
      task_name: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: Object.values(DocumentStatus),
        default: DocumentStatus.Missing,
      },
      comments: {
        type: String,
      },
      task_deadline: Date,
      // TODO: updateBy
      updatedAt: Date,
    },
  ],
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = {
  Task,
};
