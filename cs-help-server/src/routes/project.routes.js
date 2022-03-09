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
  res.json(returnedProject);
});

router.put("/api/v1/projects/:id/name", isLoggedIn, async (req, res) => {
  let projectid = req.params.id;
  let project = await projectController.getProject(projectid);
  if(project.owner !== req.session.passport?.user) {
    res.status(401);
    res.json({errMsg: "Cannot edit project you do not own"})
  } else {
    //updating project name in projects
    // project.name = req.body.name;
    const newName = req.body.name;
    projectController.renameProject(project, newName);
    res.status(200);
  }
});

router.put("/api/v1/projects/:id/archive", isLoggedIn, async (req, res) => {
  let projectid = req.params.id;
  let project = await projectController.getProject(projectid);
  if(project.owner !== req.session.passport?.user) {
    res.status(401);
    res.json({errMsg: "Cannot archive project you do not own"});
  } else {
    //updating project name in projects
    // project.name = req.body.name;
    const results = await projectController.setArchived(project, true);
    res.json(results);
    res.status(200);
    
  }
});

router.put("/api/v1/projects/:id/unarchive", isLoggedIn, async (req, res) => {
  let projectid = req.params.id;
  let project = await projectController.getProject(projectid);
  if(project.owner !== req.session.passport?.user) {
    res.status(401);
    res.json({errMsg: "Cannot unarchive project you do not own"});
  } else {
    //updating project name in projects
    // project.name = req.body.name;
    const results = await projectController.setArchived(project, false);
    res.json(results);
    res.status(200);
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
    res.status(200);
  }
});


router.put("/api/v1/projects/:id/data", isLoggedIn, async (req, res) => {
  const data = req.body.data;
  let id = req.params.id;
  let project = await projectController.getProject(id);
  if(project.owner !== req.session.passport?.user) {
    res.status(401);
    res.json({errMsg: "Cannot save a project you do not own"})
  } else {
    await projectController.saveProject(project, data);
    res.status(200).send();
  }
});



module.exports = router;
