const db = require("../models");
// const User = db.users;
const { nanoid } = require("nanoid");
const userController = require("./user.controller");
const Project = db.projects;

/**
 *  This method creates a new project to a user
 * @param {*} project  the project data
 */
exports.createProject = (project) => {
    if(project.name) {
        let projname = project.name;
        let currentUser = project.user;

        const newProject = new Project({
            _id: nanoid(),
            name: projname,
            data: {}
        });
        const projectsaved = newProject.save();
        currentUser.projects.push(newProject.toJSON());
        currentUser.save();
        return projectsaved;

    }
};