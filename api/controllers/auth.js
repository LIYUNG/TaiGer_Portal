const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_EXPIRE } = require("../config");
const { ErrorResponse } = require("../common/errors");

const {
  fieldsValidation,
  checkUserFirstname,
  checkUserLastname,
  checkEmail,
  checkPassword,
  checkToken,
} = require("../common/validation");
const { asyncHandler } = require("../middlewares/error-handler");
const { User, Guest, Role } = require("../models/User");
const Token = require("../models/Token");
const {
  sendConfirmationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetEmail,
} = require("../services/email");

const generateAuthToken = (user) => {
  const payload = { id: user._id };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

const generateRandomToken = () => crypto.randomBytes(32).toString("hex");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const signup = asyncHandler(async (req, res) => {
  await fieldsValidation(
    checkUserFirstname,
    checkUserLastname,
    checkEmail,
    checkPassword
  )(req);

  const { firstname, lastname, email, password } = req.body;

  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new ErrorResponse(
      400,
      "An account with this email address already exists"
    );
  }

  const user = await Guest.create({ firstname, lastname, email, password });

  const activationToken = generateRandomToken();
  await Token.create({ userId: user._id, value: hashToken(activationToken) });

  // await sendConfirmationEmail({ firstname, lastname, address: email }, activationToken);

  const authToken = generateAuthToken(user);
  res
    .cookie("x-auth", authToken, { httpOnly: true })
    .status(201)
    .json({ success: true, data: user });
});

const login = (req, res) => {
  const user = req.user;
  const token = generateAuthToken(user);
  res
    .cookie("x-auth", token, { httpOnly: true })
    .status(200)
    .json({ success: true, data: user });
};

const logout = (req, res) => {
  res.clearCookie("x-auth").status(200).json({ success: true });
};

const verify = (req, res) => {
  const user = req.user;
  const token = generateAuthToken(user);
  res
    .cookie("x-auth", token, { httpOnly: true })
    .status(200)
    .json({ success: true, data: user });
};

const activateAccount = asyncHandler(async (req, res) => {
  await fieldsValidation(checkEmail, checkToken)(req);

  const { email, token: activationToken } = req.body;

  const token = await Token.findOne({ value: hashToken(activationToken) });
  if (!token) throw new ErrorResponse(400, "Invalid or expired token");

  const user = await User.findOne({ _id: token.userId, email });
  if (!user) throw new ErrorResponse(400, "Invalid email or token");

  if (user.role !== Role.Guest)
    throw new ErrorResponse(400, "User account already activated");

  await User.findOneAndUpdate(
    { _id: token.userId },
    { $set: { role: Role.Student } },
    { new: true }
  );
  await token.deleteOne();

  res.status(200).json({ success: true });
});

const resendActivation = asyncHandler(async (req, res) => {
  await fieldsValidation(checkEmail)(req);

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ErrorResponse(400, "Email not found");

  if (user.role !== Role.Guest)
    throw new ErrorResponse(400, "User account already activated");

  const activationToken = generateRandomToken();
  await Token.create({
    userId: user._id,
    value: hashToken(activationToken),
  });

  await sendConfirmationEmail(
    { firstname: user.firstname, lastname: user.lastname, address: email },
    activationToken
  );

  res.status(200).json({ success: true });
});

const forgotPassword = asyncHandler(async (req, res) => {
  await fieldsValidation(checkEmail)(req);

  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ErrorResponse(400, "Email not found");

  const resetToken = generateRandomToken();
  await Token.create({ userId: user._id, value: hashToken(resetToken) });

  await sendForgotPasswordEmail(
    { firstname: user.firstname, lastname: user.lastname, address: email },
    resetToken
  );

  res.status(200).json({ success: true });
});

const resetPassword = asyncHandler(async (req, res) => {
  await fieldsValidation(checkEmail, checkPassword, checkToken)(req);

  const { email, password, token: resetToken } = req.body;

  const token = await Token.findOne({ value: hashToken(resetToken) });
  if (!token) throw new ErrorResponse(400, "Invalid or expired token");

  const user = await User.findOne({ _id: token.userId, email });
  if (!user) throw new ErrorResponse(404, "Invalid email or token");

  user.password = password;
  await user.save();

  await sendPasswordResetEmail({
    firstname: user.firstname,
    lastname: user.lastname,
    address: email,
  });
  await token.deleteOne();

  res.status(200).json({ success: true });
});

module.exports = {
  signup,
  login,
  logout,
  verify,
  activateAccount,
  resendActivation,
  forgotPassword,
  resetPassword,
};
