/**
 * Router to handle Assignment request
 *
 */
const express = require("express");
let router = express.Router();
const userController = require("../controllers/user.controller");
const projectController = require("../controllers/project.controller");
const assignmentController = require("../controllers/assignment.controller");
const isLoggedIn = require("../middleware/ensureLoggedIn");

/**
 * API used to create/open/unarchive new project from assignment
 * CREATE: If the assignment does not have user ID and project associated with it
 * OPEN: If the assignment does have user ID and project associated with it
 * UNARCHIVE: If the assignment does have user ID and project associated with it but it is archived
 * url: POST /api/v1/assignment
 * returns: newly created project
 */
router.post("/api/v1/assignment", isLoggedIn, async (req, res) => {
  let currentAssignment = await assignmentController.getAssignment(
    req.body.assignmentID
  );
  let currentUser = await userController.findUser(req.session.passport?.user);

  const projectID = assignmentController.openAssignment(
    currentAssignment,
    currentUser
  );
  if (!projectID) {
    res
      .status(400)
      .json({ errMsg: "Failed to open the project from assignment." });
  }
  res.status(201);
  res.json({ projectID: projectID });
});

/**
 * Development API to populate assignment schema with examples
 */
router.post("/api/v1/insertassignments", isLoggedIn, async (req, res) => {
  let createdAssignment = await assignmentController.createAssignment({name: req.body.name, data: req.body.data});
  if(!createdAssignment) {
    res
      .status(400)
      .json({ errMsg: "Failed to create an assignment" });
  }
  res.status(201);
  res.json(createdAssignment);
});
