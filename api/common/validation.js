const { body, param, validationResult } = require("express-validator");
const { ObjectID } = require("mongodb");

const { Role } = require("../models/User");

const fieldsValidation =
  (...rules) =>
  async (req) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) errors.throw();
  };

const makeOptional = (rule) => rule.optional();

// common rules
const checkUserFirstname = body("firstname")
  .isString()
  .notEmpty()
  .withMessage("First name cannot be empty");

const checkUserLastname = body("lastname")
  .isString()
  .notEmpty()
  .withMessage("Last name cannot be empty");

const checkEmail = body("email", "Invalid email address")
  .normalizeEmail({ gmail_remove_dots: false })
  .isEmail();

const checkPassword = body("password")
  .isString()
  .isLength({ min: 8 })
  .withMessage("Password must contain at least 8 characters");

const checkUserRole = body("role", "Invalid role").isIn(Object.values(Role));

const checkToken = body("token").isString().notEmpty();

const checkObjectID = param("id", "Invalid id").custom(ObjectID.isValid);

module.exports = {
  fieldsValidation,
  makeOptional,
  checkUserFirstname,
  checkUserLastname,
  checkEmail,
  checkPassword,
  checkUserRole,
  checkToken,
  checkObjectID,
};
