const {
  model,
  Schema,
  Types: { ObjectId }
} = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { Role, DocumentStatusType } = require('@taiger-common/core');

const { DocumentStatus, ManagerType } = require('../constants');
const { attributeSchema } = require('./common');

const { PROGRAM_SUBJECT_KEYS } = require('../constants');

const options = { discriminatorKey: 'role', timestamps: true };
const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true
    },
    firstname_chinese: {
      type: String,
      trim: true
    },
    lastname: {
      type: String,
      trim: true
    },
    lastname_chinese: {
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
    linkedIn: String,
    lineId: String,
    isAccountActivated: {
      type: Boolean,
      default: false
    },
    notification: {
      isRead_survey_not_complete: {
        type: Boolean,
        default: false
      },
      isRead_uni_assist_task_assigned: {
        type: Boolean,
        default: false
      },
      isRead_new_agent_assigned: {
        type: Boolean,
        default: true
      },
      isRead_new_editor_assigned: {
        type: Boolean,
        default: true
      },
      isRead_new_cvmlrl_tasks_created: {
        type: Boolean,
        default: true
      },
      isRead_new_cvmlrl_messsage: {
        type: Boolean,
        default: true
      },
      isRead_base_documents_missing: {
        type: Boolean,
        default: false
      },
      isRead_base_documents_rejected: {
        type: Boolean,
        default: true
      },
      isRead_new_programs_assigned: {
        type: Boolean,
        default: false
      }
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
          enum: Object.values(DocumentStatusType),
          default: DocumentStatusType.Missing
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
    application_preference: {
      expected_application_date: {
        type: String,
        default: ''
      },

      expected_application_semester: {
        type: String,
        default: ''
      },
      target_program_language: {
        type: String,
        default: ''
      },
      // To be deprecated -> read only in frontend
      target_application_field: {
        type: String,
        default: ''
      },
      targetApplicationSubjects: [
        {
          type: String,
          enum: PROGRAM_SUBJECT_KEYS
        }
      ],
      target_degree: {
        type: String,
        default: ''
      },
      considered_privat_universities: {
        type: String,
        default: '-'
      },
      special_wished: {
        type: String,
        default: ''
      },
      application_outside_germany: {
        type: String,
        default: '-'
      },
      updatedAt: Date
    },
    academic_background: {
      university: {
        high_school_isGraduated: {
          type: String,
          default: ''
        },
        attended_high_school: {
          type: String,
          default: ''
        },
        high_school_graduated_year: {
          type: String,
          default: ''
        },
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
          default: '-'
        },
        expected_grad_date: {
          type: String,
          default: ''
        },
        Highest_GPA_Uni: {
          type: Number
        },
        Passing_GPA_Uni: {
          type: Number
        },
        My_GPA_Uni: {
          type: Number
        },
        Has_Exchange_Experience: {
          type: String,
          default: '-'
        },
        isSecondGraduated: {
          type: String,
          default: '-'
        },
        expectedSecondDegreeGradDate: {
          type: String,
          default: ''
        },
        attendedSecondDegreeUniversity: {
          type: String,
          default: ''
        },
        attendedSecondDegreeProgram: {
          type: String,
          default: ''
        },
        highestSecondDegreeGPA: {
          type: Number
        },
        passingSecondDegreeGPA: {
          type: Number
        },
        mySecondDegreeGPA: {
          type: Number
        },
        Has_Internship_Experience: {
          type: String,
          default: '-'
        },
        Has_Working_Experience: {
          type: String,
          default: '-'
        },
        updatedAt: Date
      },
      language: {
        english_isPassed: {
          type: String,
          default: '-'
        },
        english_certificate: {
          type: String,
          default: ''
        },
        english_score: {
          type: String,
          default: ''
        },
        english_score_reading: {
          type: String,
          default: ''
        },
        english_score_listening: {
          type: String,
          default: ''
        },
        english_score_writing: {
          type: String,
          default: ''
        },
        english_score_speaking: {
          type: String,
          default: ''
        },
        english_test_date: {
          type: String,
          default: ''
        },
        german_isPassed: {
          type: String,
          default: '-'
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
        gre_isPassed: {
          type: String,
          default: '-'
        },
        gre_certificate: {
          type: String,
          default: ''
        },
        gre_score: {
          type: String,
          default: ''
        },
        gre_test_date: {
          type: String,
          default: ''
        },
        gmat_isPassed: {
          type: String,
          default: '-'
        },
        gmat_certificate: {
          type: String,
          default: ''
        },
        gmat_score: {
          type: String,
          default: ''
        },
        gmat_test_date: {
          type: String,
          default: ''
        },
        updatedAt: Date
      }
    },
    lastLoginAt: Date
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

UserSchema.index({
  firstname: 'text',
  lastname: 'text',
  lastname_chinese: 'text',
  firstname_chinese: 'text',
  email: 'text'
});

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
    vpd_paid_confirmation_file_path: {
      type: String,
      default: ''
    },
    vpd_paid_confirmation_file_status: {
      type: String,
      default: ''
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    updatedAt: Date
  },
  portal_credentials: {
    application_portal_a: {
      account: { type: String, select: false, trim: true },
      password: { type: String, select: false, trim: true }
    },
    application_portal_b: {
      account: { type: String, select: false, trim: true },
      password: { type: String, select: false, trim: true }
    }
  },
  doc_modification_thread: [
    {
      isFinalVersion: {
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
  admission_letter: {
    status: {
      type: String,
      default: 'notstarted'
    },
    admission_file_path: {
      type: String,
      default: ''
    },
    comments: { type: String, default: '' },
    updatedAt: Date
  },
  finalEnrolment: { type: Boolean, default: false },
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
      needEditor: { type: Boolean, default: false },
      applications: [applicationSchema],
      applying_program_count: {
        type: Number,
        default: 0
      },
      attributes: [
        {
          type: attributeSchema,
          required: true
        }
      ],
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
      generaldocs_threads: [
        {
          isFinalVersion: {
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

const External = User.discriminator(
  'External',
  new Schema(
    {
      attribute: {
        can_update_program_list: {
          type: Boolean,
          default: false
        },
        can_update_course_analysis: {
          type: Boolean,
          default: false
        },
        can_add_articles: {
          type: Boolean,
          default: false
        }
      }
    },
    options
  ),
  Role.External
);

const Manager = User.discriminator(
  'Manager',
  new Schema(
    {
      agents: [{ type: ObjectId, ref: 'Agent' }],
      editors: [{ type: ObjectId, ref: 'Editor' }],
      manager_type: {
        type: String,
        enum: Object.values(ManagerType),
        default: ManagerType.None
      },
      manager_notification: {
        isRead_new_base_docs_uploaded: [
          {
            student_id: {
              type: String,
              default: ''
            }
          }
        ],
        isRead_new_programs_assigned: {
          type: Boolean,
          default: false
        }
      },
      attribute: {
        can_write_ml: {
          type: Boolean,
          default: false
        },
        can_write_rl: {
          type: Boolean,
          default: false
        },
        can_write_cv: {
          type: Boolean,
          default: false
        },
        can_write_essay: {
          type: Boolean,
          default: false
        },
        can_do_interview: {
          type: Boolean,
          default: false
        }
      }
    },
    options
  ),
  Role.Manager
);

const Agent = User.discriminator(
  'Agent',
  new Schema(
    {
      timezone: { type: String, default: '' },
      officehours: {
        Monday: {
          active: { type: Boolean, default: false },
          time_slots: [{ type: Object }]
        },
        Tuesday: {
          active: { type: Boolean, default: false },
          time_slots: [{ type: Object }]
        },
        Wednesday: {
          active: { type: Boolean, default: false },
          time_slots: [{ type: Object }]
        },
        Thursday: {
          active: { type: Boolean, default: false },
          time_slots: [{ type: Object }]
        },
        Friday: {
          active: { type: Boolean, default: false },
          time_slots: [{ type: Object }]
        },
        Saturday: {
          active: { type: Boolean, default: false },
          time_slots: [{ type: Object }]
        },
        Sunday: {
          active: { type: Boolean, default: false },
          time_slots: [{ type: Object }]
        }
      },
      selfIntroduction: {
        type: String,
        default: ''
      },
      agent_notification: {
        isRead_new_base_docs_uploaded: [
          {
            student_id: {
              type: String,
              default: ''
            },
            student_firstname: {
              type: String,
              default: ''
            },
            student_lastname: {
              type: String,
              default: ''
            }
          }
        ],
        isRead_new_survey_updated: {
          type: Boolean,
          default: true
        },
        isRead_applications_status_changed: {
          type: Boolean,
          default: true
        },
        isRead_new_programs_assigned: {
          type: Boolean,
          default: false
        }
      }
    },
    options
  ),
  Role.Agent
);

const Editor = User.discriminator(
  'Editor',
  new Schema(
    {
      editor_notification: {
        isRead_survey_not_complete: {
          type: Boolean,
          default: false
        },
        isRead_base_documents_missing: {
          type: Boolean,
          default: false
        },
        isRead_base_documents_rejected: {
          type: Boolean,
          default: false
        },
        isRead_new_programs_assigned: {
          type: Boolean,
          default: false
        }
      },
      attribute: {
        can_write_ml: {
          type: Boolean,
          default: false
        },
        can_write_rl: {
          type: Boolean,
          default: false
        },
        can_write_cv: {
          type: Boolean,
          default: false
        },
        can_write_essay: {
          type: Boolean,
          default: false
        },
        can_do_interview: {
          type: Boolean,
          default: false
        }
      }
    },
    options
  ),
  Role.Editor
);

const Admin = User.discriminator('Admin', new Schema({}, options), Role.Admin);

module.exports = {
  User,
  UserSchema,
  Guest,
  Student,
  Agent,
  External,
  Editor,
  Manager,
  Admin
};
