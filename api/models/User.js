const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");

const Role = {
  Admin: "Admin",
  Guest: "Guest",
  Agent: "Agent",
  Editor: "Editor",
  Student: "Student",
};

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
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.Guest,
    },
  },
  { timestamps: true }
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

module.exports = { User, Role };
