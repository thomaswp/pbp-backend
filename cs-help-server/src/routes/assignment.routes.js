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
router.post("/api/v1/assignment/:id", isLoggedIn, async (req, res) => {
  let currentAssignment = await assignmentController.getAssignment(
    req.params.id
  );
  let currentUser = await userController.findUser(req.session.passport?.user);
  logger.debug(
    `POST /api/v1/assignment/:id create project from assignment ${currentAssignment}`
  );
  const projectID = await assignmentController.openAssignment(
    currentAssignment,
    currentUser._id
  );
  if (!projectID) {
    logger.error(
      `POST /api/v1/assignment/:id 400 error cannot create project from assignment`
    );
    res
      .status(400)
      .json({ errMsg: "Failed to open the project from assignment." });
  }
  logger.debug(
    `POST /api/v1/assignment/:id new project id from assignment: ${projectID}`
  );
  logger.info(`POST /api/v1/assignment/:id 200 success`);
  res.status(201);
  res.json({ projectID: projectID });
});

/**
 * Development API to populate assignment schema with examples
 */
router.post("/api/v1/insert/:projectID", isLoggedIn, async (req, res) => {
  let createdAssignment = await assignmentController.createAssignment(
    req.params.projectID
  );
  logger.debug(
    `POST /api/v1/insert/:projectID create assignment: ${createdAssignment}`
  );
  if (!createdAssignment) {
    logger.error(`POST /api/v1/insert/:projectID 500 failure`);
    res.status(500).json({ errMsg: "Failed to create an assignment" });
  }
  res.status(201);
  res.json(createdAssignment);
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
    res.status(500);
    res.json({ errMesg: "Not Found" });
  } else {
    logger.info(`GET /api/v1/assignment 200 success`);
    res.status(200);
    res.json(assignmentList);
  }
});

module.exports = router;
