/**
 * Router to handle User-focused request
 *
 */
const express = require("express");
const ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
const userController = require("../controllers/user.controller");
let router = express.Router();
let ensureLoggedIn = ensureLogIn();

/**
 * API used to test get user
 * url: GET /api/v1/users/:id
 * returns: passed ID
 */
router.get("/api/v1/users/:id", ensureLoggedIn, (req, res) => {
  let id = req.params.id;
  let sampleUser = {
    name: "John Doe " + id,
    email: "jdoe@email.com",
    session: req.session.passport.user,
  };
  res.json(sampleUser);
});

/**
 * API used to get logged-in user data
 * url: GET /api/v1/user
 * returns: User record
 */
router.get("/api/v1/user", async (req, res) => {
  let currentUser = await userController.findUser(req.session.passport?.user);
  console.log(`GET /api/v1/user current user: ${currentUser}`);
  if (!currentUser) {
    res.status(401);
    res.json({errMesg: "Unauthenticated"});
  } else {
    res.json(currentUser);
  }
});

module.exports = router;
