const passport = require("passport");
const { ErrorResponse } = require("../common/errors");

const localAuth = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user) => {
    if (err) return next(err);

    if (!user) return next(new ErrorResponse(401, "Invalid credentials"));
    console.log(user)
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
    console.log(req.user)
    if (!roles.includes(req.user.role))
      return next(new ErrorResponse(403, "Permission denied"));

    next();
  };

const prohibit =
  (...roles) =>
  (req, res, next) => {
    if (roles.includes(req.user.role))
      return next(new ErrorResponse(403, "Permission denied2"));

    next();
  };

module.exports = { localAuth, protect, permit, prohibit };
