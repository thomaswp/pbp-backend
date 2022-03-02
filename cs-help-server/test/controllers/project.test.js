// test/project.test.js
const { expect, assert } = require('chai');
const setup = require("../mongoose-setup");
const projectController = require("../../src/controllers/project.controller");
const userController = require("../../src/controllers/user.controller");

describe("Project controller test", function () {
    setup();

    it("create a valid project", async function () {
        
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: {},
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);

        const project = {
          name: "Test Project 1",
          data: {},
          owner: newUser._id
        };
        let newProject = await projectController.createProject(project, newUser);

        
        assert.isNotNull(newProject);
        expect(newProject.name).to.equal(project.name);
        expect(newProject.owner).to.equal(project.owner);
    });

    it("create a invalid project", async function () {
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: {},
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);

        const project = {
          name: "",
          data: {},
          owner: newUser._id
        };
        let newProject = await projectController.createProject(project, newUser);
        //console.log(newProject);
        assert.isFalse(newProject);

    });

    it("find a valid project", async function () {
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: {},
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);

        const project = {
          name: "Test Project 1",
          data: {},
          owner: newUser._id
        };
        let newProject = await projectController.createProject(project, newUser);
        let retProject = await projectController.getProject(newProject._id);

        expect(newProject.name).to.equal(retProject.name);
        expect(newProject.owner).to.equal(retProject.owner);
        expect(newProject._id).to.equal(retProject._id);
        
    });

});