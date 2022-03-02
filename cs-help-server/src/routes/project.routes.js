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
router.post("/api/v1/projects", isLoggedIn, async (req, res) => {
  let projname = req.body.name;
  let currentUser = await userController.findUser(req.session.passport?.user);
  const project = {
    name: projname,
    owner: currentUser._id,
  };
  let returnedProject = await projectController.createProject(project, currentUser);
  console.log(returnedProject);
  res.json(currentUser);
});

router.put("/api/v1/projects/:id/name", isLoggedIn, async (req, res) => {
  let id = req.params.id;
  let project = await projectController.getProject(id);
  if(project.owner !== req.session.passport?.user) {
    res.status(401);
    res.json({errMsg: "Cannot edit project you do not own"})
  } else {
    //updating project name in projects
    project.name = req.body.name;
    project.save();
    // updating project name in user
    let currentUser = await userController.findUser(req.session.passport?.user);
    currentUser.projects[id] = project.name;
    currentUser.save();
  }
});


/**
 * This will get the project data given the project id
 */
router.get("/api/v1/projects/:id", isLoggedIn, async (req, res) => {
  let id = req.params.id;
  let project = await projectController.getProject(id);
  if(!project) {
    res.status(404);
    res.json({ errMsg: "Project Not Found"});
  } else {
    res.json(project);
  }
});



module.exports = router;
