/**
 * Router to handle User-focused request
 *
 */
const express = require("express");
const ensureLogIn = require("connect-ensure-login").ensureLoggedIn;
const userController = require("../controllers/user.controller");
let router = express.Router();
let ensureLoggedIn = ensureLogIn();

router.get("/api/v1/users/:id", ensureLoggedIn, (req, res) => {
  let id = req.params.id;
  let sampleUser = {
    name: "John Doe " + id,
    email: "jdoe@email.com",
    session: req.session.passport.user,
  };
  res.json(sampleUser);
});

router.get("/api/v1/user", ensureLoggedIn, async (req, res) => {
  let currentUser = await userController.findUser(req.session.passport.user);

  if (!currentUser) {
    res.status(400);
    res.send("Failed to get current user");
  } else {
    res.json(currentUser);
  }
});

module.exports = router;
