/**
 * Router to handle Assignment request
 *
 */
const express = require("express");
let router = express.Router();
const userController = require("../controllers/user.controller");
const assignmentController = require("../controllers/assignment.controller");
const projectController = require("../controllers/project.controller");
const { isLoggedIn } = require("../middleware/ensureLoggedIn");
const { logger } = require("../config/logger.config");

/**
 * API used to create/open/unarchive new project from assignment
 * CREATE: If the assignment does not have user ID and project associated with it
 * OPEN: If the assignment does have user ID and project associated with it
 * UNARCHIVE: If the assignment does have user ID and project associated with it but it is archived
 * url: POST /api/v1/assignment
 * returns: newly created project
 */
router.post("/api/v1/open/assignment", isLoggedIn, async (req, res) => {
  let currentAssignment;
  let currentUser;
  try {
    currentAssignment = await assignmentController.getAssignment(
      req.body.assignmentID
    );
    currentUser = await userController.findUser(req.session.passport?.user);
  } catch (err) {
    logger.error(`POST /api/v1/assignment/:id 500 error: ${err}`);
    return res
      .status(500)
      .json({ errMsg: "Failed to open the project from assignment." });
  }
  logger.debug(
    `POST /api/v1/assignment/:id create project from existing assignment ${currentAssignment}`
  );

  if (!currentAssignment || !currentUser) {
    logger.error(
      `POST /api/v1/assignment/:id 404 error invalid assignment and user`
    );
    return res
      .status(404)
      .json({ errMsg: "Failed to open the project from assignment." });
  }

  let projectID;
  try {
    projectID = await assignmentController.openAssignment(
      currentAssignment,
      currentUser._id
    );
  } catch (err) {
    logger.error(`POST /api/v1/assignment/:id 500 error: ${err}`);
    return res.status(500).json({ errMsg: "Failed to open the assignment." });
  }

  if (!projectID) {
    logger.error(
      `POST /api/v1/assignment/:id 400 error cannot create project from assignment`
    );
    return res
      .status(400)
      .json({ errMsg: "Failed to open the project from assignment." });
  }

  logger.debug(
    `POST /api/v1/assignment/:id new project id from assignment: ${projectID}`
  );
  res.status(201);
  return res.json({ projectID: projectID });
});

/**
 * Development API to populate assignment schema with examples
 */
router.post("/api/v1/insert/assignment", isLoggedIn, async (req, res) => {
  let createdAssignment;
  try {
    createdAssignment = await assignmentController.createAssignment(
      req.body.projectID
    );
  } catch (err) {
    logger.error(`POST /api/v1/insert/assignment 500 error: ${err}`);
    return res.status(500).json({ errMsg: "Failed to create an assignment." });
  }
  logger.debug(
    `POST /api/v1/insert/:projectID create assignment: ${createdAssignment}`
  );
  if (!createdAssignment) {
    logger.error(`POST /api/v1/insert/:projectID 500 failure`);
    return res.status(500).json({ errMsg: "Failed to create an assignment" });
  }
  return res.status(201).json(createdAssignment);
});

/**
 * API used to get all assignments
 * url: GET /api/v1/assignment
 * returns: Assignment record
 */
router.get("/api/v1/assignment", isLoggedIn, async (req, res) => {
  let assignmentList = await assignmentController.getAllAssignments();
  logger.debug(`GET /api/v1/assignment all assignment: ${assignmentList}`);
  if (!assignmentList) {
    return res.status(404).json({ errMesg: "Not Found" });
  } else {
    return res.status(200).json(assignmentList);
  }
});

/**
 * API used to get an assignment
 * url: GET /api/v1/assignment/:projectId
 * returns: An assignment found by project ID
 */
router.get("/api/v1/assignment/:id", isLoggedIn, async (req, res) => {
  let currentProj = await projectController.getProject(req.params.id)
  if (!currentProj) {
    res.status(404);
    return res.json({ errMesg: "Not Found" });
  }
  let assignment = await assignmentController.getAssignment(currentProj.assignmentId);
  logger.debug(`GET /api/v1/assignment/:id get an assignment: ${assignment}`);
  if (!assignment) {
    res.status(404);
    return res.json({ errMesg: "Not Found" });
  } else {
    res.status(200);
    return res.json(assignment);
  }
});

/**
 * API used to delete an assignment
 * url: DELETE /api/v1/assignment/:id
 * returns: An assignment found by ID
 */
router.delete("/api/v1/assignment/:id", isLoggedIn, async (req, res) => {
  try {
    let assignment = await assignmentController.getAssignment(req.params.id);
    if (!assignment) {
      res.status(404);
      return res.json({ errMesg: "Not Found" });
    }
    // set project isAssignment to false
    await assignmentController.deleteAssignment(assignment);
    res.status(200);
    return res.json(assignment);
  } catch (err) {
    logger.error(`DELETE /api/v1/assignment/:id 500 error: ${err}`);
    return res.status(500).json({ errMsg: "Failed to delete an assignment." });
  }
});

module.exports = router;
