const db = require("../models");
const { nanoid } = require("nanoid");
const userController = require("./user.controller");
const Project = db.projects;

/**
 *  This method creates a new project to a user
 * @param {*} project  the project data
 */
exports.createProject = async (project, currentUser) => {
    if(project.name) {

        const newProject = new Project({
            _id: nanoid(),
            name: project.name,
            data: {},
            owner: project.owner
        });
        
        const projectsaved = newProject.save();
        
        currentUser.projects[newProject._id] = project.name;
        // console.log("in created")
        // console.log(currentUser);
        currentUser.markModified('projects');
        await currentUser.save();
        // console.log("idk")
        
        return projectsaved;

    }
    return false;
};



exports.archiveProject = (project) => {
    project.isArchived = true;
    project.save();
    return project;
};

exports.saveProject = (project, reteData) => {
    project.data = reteData;
    project.markModified('data');
    project.save();
    return project;
};


exports.renameProject = async (project, newName) => {
    // let project = Project.findById(projectID);
    project.name = newName;
    project.save();
    // console.log(project.owner);
    let user = await userController.findUser(project.owner);
    // console.log(user);
    // console.log("PROJECTS: " + user.projects);
    user.projects[project._id] = project.name;
    
    user.markModified('projects');
    // console.log(user);
    await user.save();
    return project;
};



exports.getProject = (projectID) => {
    return Project.findById(projectID);
};