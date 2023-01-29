const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy } = require('passport-jwt');

const { JWT_SECRET } = require('../config');
const { User } = require('../models/User');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
          .select('+password')
          .populate('students agents editors', 'firstname lastname email');
        if (!user) return done(null, false);

        const isPasswordValid = await user.verifyPassword(password);
        if (!isPasswordValid) return done(null, false);

        if (user.isAccountActivated !== true) {
          return done(null, 'inactivated');
        }
        // Log: login success
        const user2 = await User.findOneAndUpdate(
          { email },
          { lastLoginAt: new Date() },
          { upsert: true, new: true }
        ).populate('students agents editors', 'firstname lastname email');
        return done(null, user2);
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
      jwtFromRequest: (req) => req.cookies['x-auth']
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id).populate(
          'students agents editors',
          'firstname lastname email'
        );
        if (!user) return done(null, false);
        // Log: login success
        const user2 = await User.findByIdAndUpdate(
          payload.id,
          { lastLoginAt: new Date() },
          { upsert: true, new: true }
        ).populate('students agents editors', 'firstname lastname email');
        return done(null, user2);
      } catch (err) {
        return done(err);
      }
    }
  )
);
