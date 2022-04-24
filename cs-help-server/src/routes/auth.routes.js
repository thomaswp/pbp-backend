/**
 * Router to handle authentication with Passport
 * This router is used to handle Passport authentication using Google OAuth2
 */
const { GOOGLE_ID, GOOGLE_SECRET } = process.env;
const express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20");
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const { logger } = require("../config/logger.config");

/**
 * Passport Authentication Implementation
 * Passport allows us to use Google OAuth2 Authentication system
 *
 * GOOGLE_ID: Google ID credential
 * GOOGLE_SECRET: Secret for the Google OAuth2 service
 * callbackURL: redirect page after authentication is complete
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: "http://localhost:3060/api/v1/oauth2/redirect/google",
      scope: ["openid", "profile", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      const subject = profile.id;
      const provider = profile.provider;
      const name = `${profile.name?.givenName} ${profile.name?.familyName}`;
      const email = profile.emails[0]?.value;
      
      await authController.loginUser(cb, subject, provider, name, email)
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const currentUser = await userController.findUser(id);
  cb(null, currentUser);
});

/**
 * Authentication Routers
 */
let router = express.Router();

/**
 * Entry route to start Google authentication
 * url: GET /api/v1/login/federated/google
 * returns: Redirect to Google login
 */
router.get("/api/v1/login/federated/google", passport.authenticate("google"));

/**
 * API used by Google after authentication
 * url: GET /api/v1/oauth2/redirect/google
 * returns: redirect to success or failure login page
 */
router.get(
  "/api/v1/oauth2/redirect/google",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/homepage",
    failureRedirect: "/login",
  })
);

/**
 * API to logout current user and delete session
 * url: POST /api/v1/logout/google
 * returns: redirect to the login page
 */
router.post("/api/v1/logout/google", (req, res, next) => {
  req.logout();
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.send("Logout triggered");
  });
});

module.exports = router;
