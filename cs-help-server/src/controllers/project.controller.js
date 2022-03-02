const db = require("../models");
const { nanoid } = require("nanoid");
const userController = require("./user.controller");
const Project = db.projects;

/**
 *  This method creates a new project to a user
 * @param {*} project  the project data
 */
exports.createProject = (project, currentUser) => {
    if(project.name) {

        const newProject = new Project({
            _id: nanoid(),
            name: project.name,
            data: {},
            owner: project.owner
        });
        
        const projectsaved = newProject.save();
        
        currentUser.projects[newProject._id] = project.name;
        currentUser.save();
        
        return projectsaved;

    }
    return false;
};



exports.getProject = (projectID) => {
    return Project.findById(projectID);
};