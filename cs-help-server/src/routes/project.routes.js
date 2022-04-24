/**
 * Router to handle Project and Assignment request
 *
 */
const express = require("express");
let router = express.Router();
const userController = require("../controllers/user.controller");
const projectController = require("../controllers/project.controller");
const assignmentController = require("../controllers/assignment.controller");
const { isLoggedIn } = require("../middleware/ensureLoggedIn");
const { logger } = require("../config/logger.config");

/**
 * API used to create new project
 * url: POST /api/v1/project
 * returns: newly created project
 */
router.post("/api/v1/projects", isLoggedIn, async (req, res) => {
  let projname = req.body.name;
  try {
    let currentUser = await userController.findUser(req.session.passport?.user);
    const project = {
      name: projname,
      owner: currentUser._id,
    };
    let returnedProject = await projectController.createProject(
      project,
      currentUser
    );
    logger.debug(`POST /api/v1/projects new project: \n${returnedProject}`);
    res.status(201);
    return res.json(returnedProject);
  } catch (err) {
    logger.error(
      `POST /api/v1/projects error in creating project. Error message: \n${err}`
    );
    res.status(500);
    return res.json({ errMsg: "Error in creating project" });
  }
});

/**
 * API used to reset a project with latest assignment
 * url: POST /api/v1/project/reset
 * returns: newly updated project
 */
router.post("/api/v1/project/reset", isLoggedIn, async (req, res) => {
  let resetProject;
  let updatedProject;
  try {
    resetProject = await projectController.getProject(req.body.projectID);
    if (resetProject) {
      updatedProject = await assignmentController.resetAssignmentProject(
        resetProject
      );
    }
  } catch (err) {
    logger.error(`POST /api/v1/project/reset error: ${err}`);
    return res.status(500).json({ errMsg: "Failed to reset the project." });
  }
  if (!updatedProject) {
    logger.error(`POST /api/v1/project/reset failure`);
    return res.status(500).json({ errMsg: "Failed to reset project" });
  }
  return res.status(201).json(updatedProject);
});

/**
 * API used to update project name
 * url: PUT /api/v1/project/:id/name
 * returns: newly updated project
 */
router.put("/api/v1/projects/:id/name", isLoggedIn, async (req, res) => {
  let projectid = req.params.id;
  try {
    let project = await projectController.getProject(projectid);
    if (project.owner !== req.session.passport?.user) {
      logger.error(
        `POST /api/v1/projects/:id/name 500 error: cannot edit project you do not own}`
      );
      res.status(401);
      return res.json({ errMsg: "Cannot edit project you do not own" });
    } else if (req.body.name === "") {
      logger.error(
        `POST /api/v1/projects/:id/name 500 error: project name cannot be empty`
      );
      res.status(500);
      return res.json({ errMsg: "Name cannot be empty" });
    } else {
      //updating project name in projects
      // project.name = req.body.name;
      const newName = req.body.name;
      let updatedProject = await projectController.renameProject(
        project,
        newName
      );
      // update assignment name if this project is assignment template
      if (updatedProject.isAssignment) {
        await assignmentController.renameAssignment(updatedProject);
      }
      logger.debug(
        `PUT /api/v1/projects/:id/name updated project name: \n${updatedProject}`
      );
      res.status(200);
      return res.json(updatedProject);
    }
  } catch (err) {
    logger.error(
      `POST /api/v1/projects/:id/name 500 error in updating project name. Error message: \n${err}`
    );
    res.status(500);
    return res.json({ errMsg: "Error in updating project name" });
  }
});

/**
 * API used to archive a project
 * url: PUT /api/v1/projects/:id/archive
 * returns: newly archived project
 */
router.put("/api/v1/projects/:id/archive", isLoggedIn, async (req, res) => {
  let projectid = req.params.id;
  let project;
  try {
    project = await projectController.getProject(projectid);
  } catch (err) {
    logger.error(
      `PUT /api/v1/projects/:id/archive 500 error in archiving project. Error message: \n${err}`
    );
    res.status(500);
    return res.json({
      errMsg: "Error in archiving project, cannot find existing project",
    });
  }
  if (project.owner !== req.session.passport?.user) {
    logger.error(
      `PUT /api/v1/projects/:id/archive 401 error: cannot archive project user do not own`
    );
    res.status(401);
    return res.json({ errMsg: "Cannot archive project you do not own" });
  } else {
    const results = await projectController.setArchived(project, true);
    logger.debug(
      `PUT /api/v1/projects/:id/archive updated project: \n${results}`
    );
    res.status(200);
    return res.json(results);
  }
});

/**
 * API used to unarchive a project
 * url: PUT /api/v1/projects/:id/unarchive
 * returns: newly unarchived project
 */
router.put("/api/v1/projects/:id/unarchive", isLoggedIn, async (req, res) => {
  let projectid = req.params.id;
  let project;
  try {
    project = await projectController.getProject(projectid);
  } catch (err) {
    logger.error(
      `PUT /api/v1/projects/:id/unarchive 500 error in unarchiving project. Error message: \n${err}`
    );
    res.status(500);
    return res.json({
      errMsg: "Error in unarchiving project, cannot find existing project",
    });
  }
  if (project.owner !== req.session.passport?.user) {
    logger.error(
      `PUT /api/v1/projects/:id/unarchive 401 error: cannot unarchive project user do not own`
    );
    res.status(401);
    return res.json({ errMsg: "Cannot unarchive project you do not own" });
  } else {
    const results = await projectController.setArchived(project, false);
    logger.debug(
      `PUT /api/v1/projects/:id/unarchive updated project: \n${results}`
    );
    res.status(200);
    return res.json(results);
  }
});

/**
 * API used to get a project by id
 * url: GET /api/v1/projects/:id
 * returns: project with matching id
 */
router.get("/api/v1/projects/:id", isLoggedIn, async (req, res) => {
  let id = req.params.id;
  let project;
  try {
    project = await projectController.getProject(id);
  } catch (err) {
    logger.error(
      `GET /api/v1/projects/:id 500 error in getting project. Error message: \n${err}`
    );
    res.status(500);
    return res.json({
      errMsg: "Error in getting a project, cannot find existing project",
    });
  }
  if (!project) {
    logger.error(`GET /api/v1/projects/:id 404 error in getting project`);
    res.status(404);
    return res.json({ errMsg: "Project Not Found" });
  } else {
    logger.debug(`GET /api/v1/projects/:id found project: \n${project}`);
    res.status(200);
    return res.json(project);
  }
});

/**
 * API used to update a project by id
 * url: PUT /api/v1/projects/:id/data
 * returns: newly updated project
 */
router.put("/api/v1/projects/:id/data", isLoggedIn, async (req, res) => {
  const data = req.body.data;
  let id = req.params.id;
  let project;
  try {
    project = await projectController.getProject(id);
  } catch (err) {
    logger.error(
      `PUT /api/v1/projects/:id/data 500 error in getting project. Error message: \n${err}`
    );
    res.status(500);
    return res.json({
      errMsg: "Error in getting a project, cannot find existing project",
    });
  }
  if (project.owner !== req.session.passport?.user) {
    logger.error(`PUT /api/v1/projects/:id/data 401 error in saving project`);
    res.status(401);
    return res.json({ errMsg: "Cannot save a project you do not own" });
  } else {
    await projectController.saveProject(project, data);
    return res.status(200).send();
  }
});

module.exports = router;
