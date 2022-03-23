const db = require("../models");
const { nanoid } = require("nanoid");
const userController = require("./user.controller");
const Project = db.projects;

/**
 *  This method creates a new project to a user
 * @param {*} project  the project data
 */
exports.createProject = async (project, currentUser) => {
  // error check - must have project name
  if (!project.name) {
    return false;
  }

  // create and save new project
  const newProject = new Project({
    _id: nanoid(),
    name: project.name,
    data: project.data,
    owner: project.owner,
  });
  await newProject.save();

  // once saved, update user with new project name
  currentUser.projects[newProject._id] = {
    name: project.name,
    isArchived: project.isArchived || false,
  };
  currentUser.markModified("projects");
  await currentUser.save();

  // return the new project
  return newProject;
};

/**
 * Method to archive a project
 * @param {*} project project data
 * @param {*} isArchived is archived
 * @returns updated project
 */
exports.setArchived = async (project, isArchived = true) => {
  // update project isArchived in its document
  project.isArchived = isArchived;
  await project.save();

  // update in user document
  const owner = await userController.findUser(project.owner);
  owner.projects[project.id].isArchived = isArchived;
  owner.markModified("projects");
  await owner.save();

  // return modified project
  return project;
};

/**
 * Save a project with the rete data
 * @param {*} project target project
 * @param {*} reteData rete data
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
 * @param {*} project target project
 * @param {*} newName ew project name
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
