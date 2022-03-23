const db = require("../models");
const { nanoid } = require("nanoid");
const projectController = require("./project.controller");
const Assignment = db.assignments;

/**
 *  This method creates a new assignment
 * @param {*} assignment  the assignment data
 */
exports.createAssignment = async (assignment) => {
  // error check - must have project name
  if (!assignment.name) {
    return false;
  }
  // create and save new project
  const newAssignment = new Assignment({
    _id: nanoid(),
    name: assignment.name,
    data: assignment.data,
    copies: {},
  });
  await newAssignment.save();
  // return the new project
  return newAssignment;
};

/**
 * Get assignment by id
 * @param {*} assignmentID assignment ID
 * @returns assignment that matches with the ID
 */
exports.getAssignment = async (assignmentID) => {
  return await Assignment.findById(assignmentID);
};

/**
 * Get all assignment in the database
 * @returns List of all assignment
 */
exports.getAllAssignments = async () => {
  return await Assignment.find({});
}

/**
 * Open assignment adn do checking of what to do
 * CREATE: If the assignment does not have user ID and project associated with it
 * OPEN: If the assignment does have user ID and project associated with it
 * UNARCHIVE: If the assignment does have user ID and project associated with it but it is archived
 * @param {*} assignmentID assignment ID
 * @param {*} userID user ID
 * return assignment ID
 */
exports.openAssignment = async (assignment, user) => {
  // Check if userID is in the list of copies
  if (assignment.copies[user._id]) {
    let currentProject = await projectController.getProject(
      assignment.copies[user._id]
    );
    currentProject = await projectController.setArchived(currentProject, false);
    return assignment.copies[user._id];
  }

  // Create new project from assignment
  const newProject = {
    name: assignment.name,
    data: assignment.data,
    owner: user._id,
  };
  const createdProject = await projectController.createProject(
    newProject,
    user
  );
  if (!createdProject) {
    return false;
  }
  // Add project to assignment copies
  assignment.copies[user._id] = createdProject._id;
  assignment.markModified("copies");
  await assignment.save();
  return createdProject._id;
};
