const {
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const mongoose = require('mongoose');

const { TaskStatus } = require('../constants');

const TaskSchema = new Schema({
  student_id: { type: ObjectId, ref: 'User' },
  lanes: [
    {
      id: { type: ObjectId },
      title: { type: String },
      label: { type: String },
      style: { type: String },
      cards: [
        {
          id: { type: ObjectId },
          title: { type: String },
          label: { type: String },
          cardStyle: { type: Object },
          description: { type: String }
        }
      ]
    }
  ],
  profile_documents: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },
  cvmlrl_documents: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },
  program_selection: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },
  program_decision: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },
  program_submission: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },
  cvmlrl_template: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },
  uni_assist_process: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },
  copies_certification: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },
  visa_progress: {
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Locked
    },
    comments: {
      type: String
    },
    task_deadline: Date,
    updatedAt: Date
  },

  others: [
    {
      task_name: {
        type: String,
        default: ''
      },
      status: {
        type: String,
        enum: Object.values(TaskStatus),
        default: TaskStatus.Locked
      },
      comments: {
        type: String
      },
      task_deadline: Date,
      updatedAt: Date
    }
  ]
});

const Task = mongoose.model('Task', TaskSchema);
module.exports = {
  Task
};
