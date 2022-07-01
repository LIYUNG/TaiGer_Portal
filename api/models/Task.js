const {
  model,
  Schema,
  Types: { ObjectId },
} = require("mongoose");
const mongoose = require("mongoose");

const { TaskStatus, CheckListStatus } = require("../constants");

const TaskSchema = new Schema({
  student_id: { type: ObjectId, ref: "User" },
  profile_documents: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  cvmlrl_documents: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  program_selection: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  program_decision: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  program_submission: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  cvmlrl_template: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  uni_assist_process: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  copies_certification: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
    },
    comments: {
      type: String,
    },
    task_deadline: Date,
    // TODO: updateBy
    updatedAt: Date,
  },
  visa_progress: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked,
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
        enum: Object.values(TaskStatus),
        default: TaskStatus.Locked,
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
