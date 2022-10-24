const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const { DocumentStatus, CheckListStatus } = require('../constants');

const Role = {
  Admin: 'Admin',
  Guest: 'Guest',
  Agent: 'Agent',
  Editor: 'Editor',
  Student: 'Student'
};

const options = { discriminatorKey: 'role', timestamps: true };

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [isEmail, 'Invalid email address']
    },
    password: {
      type: String,
      select: false,
      trim: true,
      minlength: [8, 'Password must contain at least 8 characters']
    },
    archiv: { type: Boolean, default: false },
    birthday: {
      type: String,
      default: ''
    },
    isAccountActivated: {
      type: Boolean,
      default: false
    },
    taigerai: {
      input: {
        name: {
          type: String,
          default: ''
        },
        status: {
          type: String,
          enum: Object.values(DocumentStatus),
          default: DocumentStatus.Missing
        },
        file_category: {
          type: String,
          default: 'Others'
        },
        path: {
          type: String,
          default: ''
        },
        // TODO: updateBy
        updatedAt: Date
      },
      output: {
        name: {
          type: String,
          default: ''
        },
        status: {
          type: String,
          enum: Object.values(DocumentStatus),
          default: DocumentStatus.Missing
        },
        file_category: {
          type: String,
          default: 'Others'
        },
        path: {
          type: String,
          default: ''
        },
        // TODO: updateBy
        updatedAt: Date
      },
      feedback: {
        message: {
          type: String,
          default: ''
        },
        // TODO: updateBy
        updatedAt: Date
      }
    },
    academic_background: {
      university: {
        attended_university: {
          type: String,
          default: ''
        },
        attended_university_program: {
          type: String,
          default: ''
        },
        isGraduated: {
          type: String,
          default: 'No'
        },
        expected_grad_date: {
          type: String,
          default: ''
        },
        expected_application_date: {
          type: String,
          default: ''
        },
        expected_application_semester: {
          type: String,
          default: ''
        },
        Highest_GPA_Uni: {
          type: Number,
          default: 0
        },
        Passing_GPA_Uni: {
          type: Number,
          default: 0
        },
        My_GPA_Uni: {
          type: Number,
          default: 0
        },
        updatedAt: Date
      },
      language: {
        english_certificate: {
          type: String,
          default: ''
        },
        english_score: {
          type: String,
          default: ''
        },
        english_test_date: {
          type: String,
          default: ''
        },
        german_certificate: {
          type: String,
          default: ''
        },
        german_score: {
          type: String,
          default: ''
        },
        german_test_date: {
          type: String,
          default: ''
        },
        updatedAt: Date
      }
    }
  },
  options
);

UserSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.verifyPassword = function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.__v;
  delete user.password;
  return user;
};

const User = model('User', UserSchema);

const Guest = User.discriminator('Guest', new Schema({}, options), Role.Guest);

const applicationSchema = new Schema({
  programId: { type: ObjectId, ref: 'Program' },
  uni_assist: {
    status: {
      type: String,
      default: 'notstarted'
    },
    vpd_file_path: {
      type: String,
      default: ''
    },
    updatedAt: Date
  },
  doc_modification_thread: [
    {
      isFinalVersion: {
        type: Boolean,
        default: false
      },
      isReceivedEditorFeedback: {
        type: Boolean,
        default: false
      },
      isReceivedStudentFeedback: {
        type: Boolean,
        default: false
      },
      StudentRead: {
        type: Boolean,
        default: false
      },
      EditorRead: {
        type: Boolean,
        default: false
      },
      latest_message_left_by_id: {
        type: String,
        default: ''
      },
      doc_thread_id: { type: ObjectId, ref: 'Documentthread' },
      updatedAt: Date,
      createdAt: Date
    }
  ],
  reject_reason: {
    type: String,
    default: ''
  },
  decided: { type: String, default: '-' },
  closed: { type: String, default: '-' },
  admission: { type: String, default: '-' }
});

const Student = User.discriminator(
  'Student',
  new Schema(
    {
      agents: [{ type: ObjectId, ref: 'Agent' }],
      editors: [{ type: ObjectId, ref: 'Editor' }],
      applications: [applicationSchema],
      applying_program_count: {
        type: Number,
        default: 0
      },
      profile: [
        {
          name: {
            type: String,
            required: true
          },
          status: {
            type: String,
            enum: Object.values(DocumentStatus),
            default: DocumentStatus.Missing
          },
          required: {
            type: Boolean,
            required: true
          },
          path: {
            type: String,
            default: ''
          },
          feedback: {
            type: String,
            default: ''
          },
          // TODO: updateBy
          updatedAt: Date
        }
      ],
      checklist: {
        course_analysis: {
          name: { type: String, default: 'Course Analysis' },
          isNeeded: { type: Boolean, default: true },
          status: {
            type: String,
            enum: Object.values(CheckListStatus),
            default: CheckListStatus.NotStarted
          },
          updatedAt: Date
        },
        uni_assist: {
          name: { type: String, default: 'Uni-Assist' },
          isNeeded: { type: Boolean, default: true },
          status: {
            type: String,
            enum: Object.values(CheckListStatus),
            default: CheckListStatus.NotStarted
          },
          updatedAt: Date
        },
        certification_instruction: {
          name: { type: String, default: 'Copy Certification' },
          isNeeded: { type: Boolean, default: true },
          status: {
            type: String,
            enum: Object.values(CheckListStatus),
            default: CheckListStatus.NotStarted
          },
          updatedAt: Date
        },
        blocked_account_instruction: {
          name: { type: String, default: 'Blocked Account' },
          isNeeded: { type: Boolean, default: true },
          status: {
            type: String,
            enum: Object.values(CheckListStatus),
            default: CheckListStatus.NotStarted
          },
          updatedAt: Date
        },
        health_insurance_instruction: {
          name: { type: String, default: 'Health Insurance' },
          isNeeded: { type: Boolean, default: true },
          status: {
            type: String,
            enum: Object.values(CheckListStatus),
            default: CheckListStatus.NotStarted
          },
          updatedAt: Date
        },
        visa_instruction: {
          name: { type: String, default: 'Visa Instruction' },
          isNeeded: { type: Boolean, default: true },
          status: {
            type: String,
            enum: Object.values(CheckListStatus),
            default: CheckListStatus.NotStarted
          },
          updatedAt: Date
        }
      },
      generaldocs_threads: [
        {
          isFinalVersion: {
            type: Boolean,
            default: false
          },
          isReceivedEditorFeedback: {
            type: Boolean,
            default: false
          },
          isReceivedStudentFeedback: {
            type: Boolean,
            default: false
          },
          StudentRead: {
            type: Boolean,
            default: false
          },
          EditorRead: {
            type: Boolean,
            default: false
          },
          latest_message_left_by_id: {
            type: String,
            default: ''
          },
          doc_thread_id: { type: ObjectId, ref: 'Documentthread' },
          updatedAt: Date,
          createdAt: Date
        }
      ]
    },
    options
  ),
  Role.Student
);

const Agent = User.discriminator(
  'Agent',
  new Schema(
    {
      students: [{ type: ObjectId, ref: 'Student' }]
    },
    options
  ),
  Role.Agent
);

const Editor = User.discriminator(
  'Editor',
  new Schema(
    {
      students: [{ type: ObjectId, ref: 'Student' }]
    },
    options
  ),
  Role.Editor
);

const Admin = User.discriminator('Admin', new Schema({}, options), Role.Admin);

module.exports = { Role, User, Guest, Student, Agent, Editor, Admin };
