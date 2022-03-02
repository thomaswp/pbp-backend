/**
 * Router to handle project-focused request
 *
 */
const express = require("express");
let router = express.Router();
const userController = require("../controllers/user.controller");
const projectController = require("../controllers/project.controller");
const isLoggedIn = require("../middleware/ensureLoggedIn");

/**
 * API used to create new project
 * url: POST /api/v1/project
 * returns: newly created project
 */
router.post("/api/v1/project", isLoggedIn, async (req, res) => {
  let projname = req.body.name;
  let currentUser = await userController.findUser(req.session.passport?.user);
  const project = {
    name: projname,
    user: currentUser,
  };
  let returnedProject = await projectController.createProject(project);
  console.log(returnedProject);
  res.json(currentUser);
});

module.exports = router;
