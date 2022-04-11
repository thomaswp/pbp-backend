const db = require("../models");
const { nanoid } = require("nanoid");
const projectController = require("./project.controller");
const userController = require("./user.controller");
const Assignment = db.assignments;

/**
 * Function to help update project list status in User schema
 * @param {*} project project to be updated
 */
exports.updateUserAssignmentStatus = async (project) => {
  let user = await userController.findUser(project.owner);
  user.projects[project._id].isAssignment = project.isAssignment;
  user.projects[project._id].isAssignmentCopy = project.isAssignmentCopy;
  user.markModified("projects");
  await user.save();
};

/**
 * This method creates a new assignment by setting the project isAssignment to true
 * @param {*} projectID  the project ID
 */
exports.createAssignment = async (projectID) => {
  // error check - must have project name and isAssignment should be false
  let project = await projectController.getProject(projectID);
  if (!project || project.isAssignment) {
    return false;
  }
  // Update project isAssignment properties
  project.isAssignment = true;
  await project.save();
  // create and save new Assignment
  const newAssignment = new Assignment({
    _id: nanoid(),
    name: project.name,
    projectId: project._id,
    copies: {},
  });
  newAssignment.copies[project.owner] = project._id;
  await newAssignment.save();

  // Update User projects list
  await this.updateUserAssignmentStatus(project);

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
};

/**
 * Rename assignment if the project that the assignment
 * based from is changed.
 * @param {*} project
 * @returns
 */
exports.renameAssignment = async (project) => {
  return await Assignment.findOneAndUpdate(
    { projectId: project._id },
    { name: project.name },
    { new: true }
  );
};

/**
 * Open assignment adn do checking of what to do
 * CREATE: If the assignment does not have user ID and project associated with it
 * OPEN: If the assignment does have user ID and project associated with it
 * UNARCHIVE: If the assignment does have user ID and project associated with it but it is archived
 * @param {*} assignment assignment
 * @param {*} userID user ID
 * return assignment ID
 */
exports.openAssignment = async (assignment, userID) => {
  // Check if userID is in the list of copies
  let user = await userController.findUser(userID);
  if (assignment.copies[user._id]) {
    let currentProject = await projectController.getProject(
      assignment.copies[user._id]
    );
    currentProject = await projectController.setArchived(currentProject, false);
    return assignment.copies[user._id];
  }

  // Create new project from assignment project
  let assignmentProject = await projectController.getProject(
    assignment.projectId
  );
  const newProject = {
    name: assignmentProject.name,
    data: assignmentProject.data,
    owner: userID,
  };
  const createdProject = await projectController.createProject(
    newProject,
    user,
    false,
    true,
    assignment._id
  );

  // Update User projects list
  await this.updateUserAssignmentStatus(createdProject);

  // Add project to assignment copies
  assignment.copies[user._id] = createdProject._id;
  assignment.markModified("copies");
  await assignment.save();
  return createdProject._id;
};

/**
 * Delete an assignment and set isAssignmentCopy and assignmentId
 * inside a Project to false and empty string, respectively
 * @param {*} assignment assignment
 * @returns
 */
exports.deleteAssignment = async (assignment) => {
  // Delete project assignment template
  let project = await projectController.getProject(assignment.projectId);
  if (!project) {
    return false;
  }
  project.isAssignment = false;
  await project.save();

  // Delete all copies of projects inside an assignment
  let listOfProjectsPromise = [];
  for (const [userId, projectId] of Object.entries(assignment.copies)) {
    //console.log(`${userId}: ${projectId}`);
    listOfProjectsPromise.push(projectController.getProject(projectId));
  }
  let projects = await Promise.all(listOfProjectsPromise);

  let listOfSaveProjectsPromise = [];
  projects.forEach((project) => {
    project.assignmentId = "";
    project.isAssignmentCopy = false;
    listOfSaveProjectsPromise.push(project.save());
  });
  await Promise.all(listOfSaveProjectsPromise);

  // Update user project list
  let listOfUpdateuserProj = [];
  projects.forEach((project) => {
    listOfUpdateuserProj.push(this.updateUserAssignmentStatus(project));
  });
  await Promise.all(listOfUpdateuserProj);

  //delete assignment
  await assignment.deleteOne();
  return assignment;
};

/**
 * Reset project with the latest assignment data
 * @param {*} projectID project ID to reset
 * @param {*} assignment Assignment
 * @returns updated project data
 */
exports.resetAssignmentProject = async (project) => {
  // Get Assignment
  if (project.assignmentId !== "") {
    let assignment = await this.getAssignment(project.assignmentId);
    let assignmentProject = await projectController.getProject(
      assignment.projectId
    );

    // reset project
    project.data = assignmentProject.data;
    return await project.save();
  }

  return false;
};
