/**
 * Router to handle Assignment request
 *
 */
const express = require("express");
let router = express.Router();
const userController = require("../controllers/user.controller");
const assignmentController = require("../controllers/assignment.controller");
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
  let currentAssignment = await assignmentController.getAssignment(req.body.assignmentID);
  let currentUser = await userController.findUser(req.session.passport?.user);
  logger.debug(
    `POST /api/v1/assignment/:id create project from existing assignment ${currentAssignment}`
  );
  if(!currentAssignment || !currentUser) {
    logger.error(
      `POST /api/v1/assignment/:id 400 error failed to open assignment from the given assignment ID`
    );
    return res
      .status(400)
      .json({ errMsg: "Failed to open the project from assignment." });
  }
  const projectID = await assignmentController.openAssignment(
    currentAssignment,
    currentUser._id
  );
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
  logger.info(`POST /api/v1/assignment/:id 200 success`);
  res.status(201);
  return res.json({ projectID: projectID });
});

/**
 * Development API to populate assignment schema with examples
 */
router.post("/api/v1/insert/assignment", isLoggedIn, async (req, res) => {
  let createdAssignment = await assignmentController.createAssignment(
    req.body.projectID
  );
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
    return res.status(500).json({ errMesg: "Not Found" });
  } else {
    logger.info(`GET /api/v1/assignment 200 success`);
    return res.status(200).json(assignmentList);
  }
});

/**
 * API used to get an assignment
 * url: GET /api/v1/assignment/:id
 * returns: An assignment found by ID
 */
 router.get("/api/v1/assignment/:id", isLoggedIn, async (req, res) => {
  let assignment = await assignmentController.getAssignment(req.params.id);
  logger.debug(`GET /api/v1/assignment/:id get an assignment: ${assignment}`);
  if (!assignment) {
    res.status(500);
    return res.json({ errMesg: "Not Found" });
  } else {
    logger.info(`GET /api/v1/assignment/:id 200 success`);
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
  let assignment = await assignmentController.getAssignment(req.params.id);
  if (!assignment) {
    res.status(500);
    return res.json({ errMesg: "Not Found" });
  }
  // set project isAssignment to false
  await assignmentController.deleteAssignment(assignment);
  logger.info(`DELETE /api/v1/assignment/:id 200 success`);
  res.status(200);
  return res.json(assignment);
});

module.exports = router;
