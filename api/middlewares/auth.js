const passport = require("passport");
const { ErrorResponse } = require("../common/errors");

const Student = require('../models/Students')
const jwt = require("jsonwebtoken");

const { JWT_KEY } = require('../config')

// TODO: remove this function
async function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { emailaddress } = jwt.verify(token, JWT_KEY);
    const user = await Student.findOne({ emailaddress_: emailaddress });
    if (!user) return next(new ErrorResponse(401, 'User not found'))

    req.user = user
    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) console.log("JsonWebTokenError");
    if (e instanceof jwt.TokenExpiredError) console.log("jwt expired");
    else console.log("Error by auth");
    return res.status(401).end();
  }
}

const localAuth = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err) return next(err);

    if (!user) return next(new ErrorResponse(401, "Invalid credentials"));

    req.user = user;
    next();
  })(req, res, next);
};

const protect = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);

    if (!user) return next(new ErrorResponse(401, "Unauthorized"));

    req.user = user;
    next();
  })(req, res, next);
};

const permit =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role_))
      return next(new ErrorResponse(403, "Permission denied"));

    next();
  };

const prohibit =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user.role_))
      return next(new ErrorResponse(403, "Permission denied"));

    next();
  };

module.exports = { auth, localAuth, protect, permit, prohibit };
