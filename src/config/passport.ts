import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import type { IUser } from '../models/User';

// Determine the callback URL based on environment
const callbackURL = process.env.NODE_ENV === 'production'
  ? 'https://photo-trace.onrender.com/auth/google/callback'
  : '/auth/google/callback';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL
  },
  async (_accessToken, _refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id }) as IUser | null;

      if (!user) {
        // Create new user if they don't exist
        user = await User.create({
          googleId: profile.id,
          email: profile.emails?.[0]?.value,
          displayName: profile.displayName,
          profilePicture: profile.photos?.[0]?.value
        });
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
));

// Serialize user for the session
passport.serializeUser((user: Express.User, done) => {
  done(null, (user as IUser).id);
});

// Deserialize user from the session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id) as IUser | null;
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport; 