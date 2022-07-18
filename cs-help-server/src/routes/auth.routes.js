const { APP_PROTOCOL, APP_FQDN, APP_LOCAL_PORT } = process.env

/**
 * Router to handle authentication with Passport
 * This router is used to handle Passport authentication using Google OAuth2
 */
const { GOOGLE_ID, GOOGLE_SECRET, MICROSOFT_ID, MICROSOFT_SECRET } = process.env;
const express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth20");
var MicrosoftStrategy = require('passport-microsoft').Strategy;
var LocalStrategy = require('passport-local');
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

/**
 * Passport Google Authentication Implementation
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
      callbackURL: `${APP_PROTOCOL}://${APP_FQDN}:${APP_LOCAL_PORT}/api/v1/oauth2/redirect/google`,
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

/**
 * Here's a list of the pages I used that helped me get this working:
 *  - [passport strategy](https://www.passportjs.org/packages/passport-microsoft/)
 *  - [moodle guide that worked for our needs](https://docs.moodle.org/400/en/OAuth_2_Microsoft_service)
 *      - ignoring everything under "Additional Single Tenancy Configuration"
 * bug fixing:
 *  - [for redirect uri, has to be the exact uri, not just "FQDN:PORT"](https://docs.microsoft.com/en-us/answers/questions/557580/expose-an-api-registering-an-static-azure-web-page.html)
 *  - [for redirect, using web instead of SPA](https://stackoverflow.com/questions/64692600/aadsts9002325-proof-key-for-code-exchange-is-required-for-cross-origin-authoriz)
 *  - [for audience, use "org accounts and personal accounts"](https://docs.microsoft.com/en-us/answers/questions/558703/when-i-am-trying-to-make-my-first-api-call-i-get-3.html)
 */
passport.use(
  new MicrosoftStrategy(
    {
      clientID: MICROSOFT_ID,
      clientSecret: MICROSOFT_SECRET,
      callbackURL: `${APP_PROTOCOL}://${APP_FQDN}:${APP_LOCAL_PORT}/api/v1/oauth2/redirect/microsoft`,
      scope: ['user.read']
    },
    async (accessToken, refreshToken, profile, cb) => {

      const subject = profile.id;
      const provider = profile.provider;
      const name = `${profile.name?.givenName} ${profile.name?.familyName}`;
      const email = profile.emails[0]?.value;

      await authController.loginUser(cb, subject, provider, name, email);
    }
  )
);

/**
 * Local Strategy to allow login via username only
 * using no-password approach from:
 * https://stackoverflow.com/questions/35079795/passport-login-authentication-without-password-field
 */
passport.use(
  new LocalStrategy({
      // no password field
      usernameField: 'username',
      passwordField: 'username',
    },
    async function(username, password, cb) {

      const subject = username;
      const provider = "local_nppass";
      const name = username;
      const email = username; // maybe blank string ""?

      await authController.loginUser(cb, subject, provider, name, email);
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
 * Entry route to start Microsoft authentication
 * url: GET /api/v1/login/federated/microsoft
 * returns: Redirect to Microsoft login
 */
router.get("/api/v1/login/federated/microsoft", passport.authenticate("microsoft"));

/**
 * API used by Microsoft after authentication
 * url: GET /api/v1/oauth2/redirect/microsoft
 * returns: redirect to success or failure login page
 */
router.get(
  "/api/v1/oauth2/redirect/microsoft",
  passport.authenticate("microsoft", {
    successReturnToOrRedirect: "/homepage",
    failureRedirect: "/login",
  })
);



/**
 * Entry route to start local authentication
 * url: POST /api/v1/login/local/nopass
 * returns: Redirect to success or failure login page
 *    (failure should never happen, as account is created if it doesn't exist)
 */
router.post('/api/v1/login/local/nopass',
  passport.authenticate('local', { failureRedirect: '/login' } ),
  function(req, res) {
    console.log("succeeded in route handler")
    res.status(200).redirect('/homepage');
  }
)

/**
 * API to logout current user and delete session
 * url: POST /api/v1/logout
 * returns: redirect to the login page
 */
router.post("/api/v1/logout", (req, res, next) => {
  req.logout();
  req.session.destroy((err) => {
    res.clearCookie("connect.sid");
    res.send("Logout triggered");
  });
});

module.exports = router;
