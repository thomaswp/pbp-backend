/**
 * Router to handle User-focused request
 * Contains API routes for User
 */
const express = require("express");
const userController = require("../controllers/user.controller");
const { isLoggedIn } = require("../middleware/ensureLoggedIn");
const { logger } = require("../config/logger.config");
let router = express.Router();

/**
 * API used to test get user
 * url: GET /api/v1/users/:id
 * returns: passed ID
 */
router.get("/api/v1/users/:id", isLoggedIn, async (req, res) => {
  let id = req.params.id;
  let founduser = await userController.findUser(id);
  if(!founduser) {
    res.status(404);
    return res.json({ errMesg: "Not Found" });
  } else {
    res.status(200);
    return res.json(founduser);
  }
});

/**
 * API used to get logged-in user data
 * url: GET /api/v1/user
 * returns: User record
 */
router.get("/api/v1/user", 
// isLoggedIn, 
async (req, res) => {
  let currentUser = await userController.findUser(req.session.passport?.user);
  logger.debug(`GET /api/v1/user current user: \n${currentUser}`);
  if (!currentUser) {
    res.status(404);
    return res.json({ errMesg: "Not Found" });
  } else {
    res.status(200);
    return res.json(currentUser);
  }
});

module.exports = router;
