import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });
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
    }
    catch (error) {
        return done(error);
    }
}));
// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});
// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
export default passport;
