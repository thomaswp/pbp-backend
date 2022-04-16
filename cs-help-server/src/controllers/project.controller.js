const db = require("../models");
const { nanoid } = require("nanoid");
const userController = require("./user.controller");
const Project = db.projects;

/**
 *  This method creates a new project for a user
 * @param {*} project  the project data
 * @returns the new project that is created
 */
exports.createProject = async (
  project,
  currentUser,
  isAnAssignment = false,
  isAnAssignmentCopy = false,
  assignmentID = ""
) => {
  // error check - must have project name
  if (!project.name) {
    return false;
  }

  // create and save new project
  const newProject = new Project({
    _id: nanoid(),
    name: project.name,
    data: project.data || {},
    owner: project.owner,
    isAssignment: isAnAssignment,
    isAssignmentCopy: isAnAssignmentCopy,
    assignmentId: assignmentID,
  });
  await newProject.save();

  // once saved, update user with new project name
  currentUser.projects[newProject._id] = {
    name: project.name,
    isArchived: project.isArchived || false,
    isAssignment: isAnAssignment,
    isAssignmentCopy: isAnAssignmentCopy,
  };
  currentUser.markModified("projects");
  await currentUser.save();

  // return the new project
  return newProject;
};

/**
 * Method to archive a project
 * @param {*} project project data, project to be archived or unarchived
 * @param {*} isArchived is archived, by default true to set project archvied
 * @returns updated project
 */
exports.setArchived = async (project, isArchived = true) => {
  // update project isArchived in its document
  project.isArchived = isArchived;
  await project.save();

  // update in user document
  let owner = await userController.findUser(project.owner);
  owner.projects[project.id].isArchived = isArchived;
  owner.markModified("projects");
  await owner.save();

  // return modified project
  return project;
};

/**
 * Save a project with the rete data to the database
 * @param {*} project target project to be saved
 * @param {*} reteData rete data to be saved
 * @returns newly saved project
 */
exports.saveProject = async (project, reteData) => {
  // update project data in its document
  project.data = reteData;
  project.markModified("data");
  await project.save();

  // return modified project
  return project;
};

/**
 * Rename a project
 * @param {*} project target project to be renamed
 * @param {*} newName new project name
 * @returns newly renamed project
 */
exports.renameProject = async (project, newName) => {
  // update project name in its own doecument
  project.name = newName;
  await project.save();

  // mark the updated project in the user document
  let user = await userController.findUser(project.owner);
  user.projects[project._id].name = project.name;
  user.markModified("projects");
  await user.save();

  // return modified project
  return project;
};

/**
 * Get project by id
 * @param {*} projectID project ID
 * @returns project that matches with the ID
 */
exports.getProject = async (projectID) => {
  return await Project.findById(projectID);
};
