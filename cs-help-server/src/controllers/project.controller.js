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
    if(!project.name) {
        return false;
    }

    // create and save new project
    const newProject = new Project({
        _id: nanoid(),
        name: project.name,
        data: {},
        owner: project.owner
    });
    await newProject.save();
    
    // once saved, update user with new project name
    currentUser.projects[newProject._id] = project.name;
    currentUser.markModified('projects');
    await currentUser.save();
    
    // return the new project
    return newProject;
};



exports.setArchived = async (project, isArchived = true) => {
    // update project isArchived in its document
    project.isArchived = isArchived;
    await project.save();

    // return modified project
    return project;
};

exports.saveProject = async (project, reteData) => {
    // update project data in its document
    project.data = reteData;
    project.markModified('data');
    await project.save();

    // return modified project
    return project;
};


exports.renameProject = async (project, newName) => {
    // update project name in its own doecument
    project.name = newName;
    await project.save();

    // mark the updated project in the user document
    let user = await userController.findUser(project.owner);
    user.projects[project._id] = project.name;
    user.markModified('projects');
    await user.save();

    // return modified project
    return project;
};



exports.getProject = async (projectID) => {
    return await Project.findById(projectID);
};
