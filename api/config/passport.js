const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const User = require('../model/User.model');
const hash = require('../config/hash');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

//GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        social_id: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        password: hash.randomPassword(),
        isActive: true,
      };
      try {
        let user = await User.findOne({ social_id: profile.id });
        if (user) {
          // console.log(user);
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (error) {
        console.error(error);
      }
    }
  )
);

//GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
      scope: 'user:email',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      // const newUser = {
      //   social_id: profile.id,
      //   firstName: profile.name,
      //   displayName: profile.name,
      //   email: profile.emails[0].value,
      //   avatar: profile.photos[0].value,
      //   password: hash.randomPassword(),
      //   isActive: true,
      // };
      done(null, profile);
    }
  )
);

//FACEBOOK
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: '/api/auth/facebook/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      done(null, profile);
    }
  )
);

//
passport.serializeUser((user, done) => {
  console.log('1', user.id);
  done(null, user.id);
});

passport.deserializeUser((user, done) => {
  console.log(user);
  done(null, user);
});
