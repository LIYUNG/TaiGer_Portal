const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy } = require('passport-jwt');

const { JWT_SECRET } = require('../config');
const { UserSchema } = require('../models/User');

const getUserModel = (db) => db.model('User', UserSchema);

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        console.log(`req: ${req}`);
        console.log(`req.db: ${req.db}`);
        console.log(`email: ${email}`);
        console.log(`password: ${password}`);
        const User = getUserModel(req.db);
        const user_test = await User.findOne({ email }).lean();
        console.log(`user_test: ${user_test.firstname}`);
        const user = await User.findOne({ email }).select('+password');

        if (!user) return done(null, false);

        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) return done(null, false);

        if (user.isAccountActivated !== true) {
          return done(null, 'inactivated');
        }
        // Log: login success
        await User.findOneAndUpdate(
          { email },
          { lastLoginAt: new Date() },
          { upsert: true }
        );
        console.log('pass');
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: (req) => req.cookies['x-auth'],
      passReqToCallback: true
    },
    async (req, payload, done) => {
      try {
        const User = getUserModel(req.db);
        const user = await User.findById(payload.id);
        // const user = await User.findById(payload.id).populate({
        //   path: 'agents editors',
        //   select: 'firstname lastname email',
        //   options: { strictPopulate: false } // Set strictPopulate to false for this populate query
        // });
        if (!user) return done(null, false);
        // Log: login success
        await User.findByIdAndUpdate(
          payload.id,
          { lastLoginAt: new Date() },
          { upsert: true }
        );
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
