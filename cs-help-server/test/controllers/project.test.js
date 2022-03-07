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

        expect(newUser.projects[newProject.id]).to.equal("Test Project 1");
        // console.log("before get")
        // console.log(newUser);
        newUser = await userController.findUser(newUser.id);
        // console.log("after get");
        // console.log(newUser);

        expect(newUser.projects[newProject.id]).to.equal("Test Project 1");
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

    it("rename a project", async function () {
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: {},
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);
        // console.log(newUser);

        const project = {
          name: "Test Project 1",
          data: {},
          owner: newUser._id
        };

        let newProject = await projectController.createProject(project, newUser);
        newUser = await userController.findUser(newUser.id);
        // console.log(newUser);


        await projectController.renameProject(newProject, "Test2");
        // console.log("1")
        // console.log(newUser);
        newUser = await userController.findUser(newUser.id);
        // console.log("2");
        // console.log(newUser);

        expect(newProject.name).to.equal("Test2");
        expect(newUser.projects[newProject._id]).to.equal("Test2");
        
    });

    it("save a project", async function() {
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: Object,
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);
        // console.log(newUser);

        const project = {
          name: "Test Project 1",
          data: Object,
          owner: newUser._id
        };

        let newProject = await projectController.createProject(project, newUser);

        const data = {
            text: "string"
        }

        newProject = await projectController.saveProject(newProject, data);
        // console.log(newProject);
        expect(newProject.data["text"]).to.equal("string");

        newProject = await projectController.getProject(newProject.id);
        // console.log(newProject);
        expect(newProject.data["text"]).to.equal("string");
        
    });

    

});