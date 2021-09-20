const {
  model,
  Schema,
  Types: { ObjectId },
} = require("mongoose");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");

const { DocumentStatus } = require("../constants")

const Role = {
  Admin: "Admin",
  Guest: "Guest",
  Agent: "Agent",
  Editor: "Editor",
  Student: "Student",
};

const options = { discriminatorKey: "role", timestamps: true };

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [isEmail, "Invalid email address"],
    },
    password: {
      type: String,
      trim: true,
      minlength: [8, "Password must contain at least 8 characters"],
    },
  },
  options
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

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

const User = model("User", UserSchema);

const Guest = User.discriminator("Guest", new Schema({}, options), Role.Guest);

const applicationSchema = new Schema({
  programId: { type: ObjectId, ref: "Program" },
  documents: [
    {
      name: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: Object.values(DocumentStatus),
        default: DocumentStatus.Missing,
      },
      required: {
        type: Boolean,
        required: true,
      },
      path: {
        type: String,
        default: "",
      },
      // TODO: updateBy
      updatedAt: Date,
    },
  ],
});

const Student = User.discriminator(
  "Student",
  new Schema(
    {
      agents: [{ type: ObjectId, ref: "Agent" }],
      editors: [{ type: ObjectId, ref: "Editor" }],
      applications: [applicationSchema],
    },
    options
  ),
  Role.Student
);

const Agent = User.discriminator(
  "Agent",
  new Schema(
    {
      students: [{ type: ObjectId, ref: "Student" }],
    },
    options
  ),
  Role.Agent
);

const Editor = User.discriminator(
  "Editor",
  new Schema(
    {
      students: [{ type: ObjectId, ref: "Student" }],
    },
    options
  ),
  Role.Editor
);

const Admin = User.discriminator("Admin", new Schema({}, options), Role.Admin);

module.exports = { Role, User, Guest, Student, Agent, Editor, Admin };
