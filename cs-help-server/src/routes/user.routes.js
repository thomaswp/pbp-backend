/**
 * Router to handle User-focused request
 * Contains API routes for User
 */
const express = require("express");
const userController = require("../controllers/user.controller");
const isLoggedIn = require("../middleware/ensureLoggedIn");
let router = express.Router();

/**
 * API used to test get user
 * url: GET /api/v1/users/:id
 * returns: passed ID
 */
router.get("/api/v1/users/:id", isLoggedIn, (req, res) => {
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
router.get("/api/v1/user", isLoggedIn, async (req, res) => {
  let currentUser = await userController.findUser(req.session.passport?.user);
  console.log(`GET /api/v1/user current user: ${currentUser}`);
  if (!currentUser) {
    res.status(500);
    res.json({ errMesg: "Not Found" });
  } else {
    res.json(currentUser);
  }
});

module.exports = router;
