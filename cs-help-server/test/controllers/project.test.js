// test/project.test.js
const { expect, assert } = require('chai');
const setup = require("../mongoose-setup");
const projectController = require("../../src/controllers/project.controller");
const userController = require("../../src/controllers/user.controller");

describe("Project controller test", function () {
    setup();

    it("create a valid project", async function () {

        // SETUP
        
        // create user
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: {},
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);



        // ACTION

        // create project
        const project = {
          name: "Test Project 1",
          data: {},
          owner: newUser._id
        };
        let newProject = await projectController.createProject(project, newUser);



        // RESULT

        // ensure return value from createProject is good
        assert.isNotNull(newProject);
        expect(newProject.name).to.equal(project.name);
        expect(newProject.owner).to.equal(project.owner);
        // re-fecth project, ensure data is still good
        await newProject.reload();
        assert.isNotNull(newProject);
        expect(newProject.name).to.equal(project.name);
        expect(newProject.owner).to.equal(project.owner);

        // test that the user ref we pass in args was updated correctly
        expect(newUser.projects[newProject.id]).to.equal("Test Project 1");
        // re-fetch user, ensure data is still good
        await newUser.reload();
        expect(newUser.projects[newProject.id]).to.equal("Test Project 1");
    });





    it("create a invalid project", async function () {
        
        // SETUP
        
        // create user to hold project
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: {},
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);



        // ACTION

        // create invalid project, no name
        const project = {
          name: "",
          data: {},
          owner: newUser._id
        };
        let newProject = await projectController.createProject(project, newUser);



        // RESULT

        // project returned should not be valid
        assert.isFalse(newProject);

    });





    it("find a valid project", async function () {

        // SETUP

        // create a user for holding project
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: {},
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);
        
        // create a valid project
        const project = {
          name: "Test Project 1",
          data: {},
          owner: newUser._id
        };
        let newProject = await projectController.createProject(project, newUser);



        // ACTION

        // find project by id
        let retProject = await projectController.getProject(newProject._id);



        // RESULT

        // expect project data matches
        expect(newProject.name).to.equal(retProject.name);
        expect(newProject.owner).to.equal(retProject.owner);
        expect(newProject._id).to.equal(retProject._id);
    });





    it("rename a project", async function () {

        // SETUP

        // create a user to hold the project
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: {},
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);

        // create a project to rename
        const project = {
          name: "Test Project 1",
          data: {},
          owner: newUser._id
        };
        let newProject = await projectController.createProject(project, newUser);



        // ACTION

        // rename the project to something else
        await projectController.renameProject(newProject, "Test2");



        // RESULT

        // Test update in project
        // expect that project reference passed in has changed its name
        expect(newProject.name).to.equal("Test2");
        // re-fetch project from db, ensure name is changed
        await newProject.reload();
        expect(newProject.name).to.equal("Test2");

        // Test update in user
        // re-fetch user from db, ensure project name changed
        await newUser.reload();
        expect(newProject.name).to.equal("Test2");
        expect(newUser.projects[newProject._id]).to.equal("Test2");
        
    });





    it("save a project", async function() {
        
        // SETUP

        // create user to hold project
        const user = {
            name: "JohnDoe",
            email: "jdoe@ncsu.edu",
            projects: Object,
            templates: ["p1_template"],
        };
        let newUser = await userController.createUser(user);

        // create project to be updated
        const project = {
          name: "Test Project 1",
          data: Object,
          owner: newUser._id
        };
        let newProject = await projectController.createProject(project, newUser);
        


        // ACTION

        // Create and save new data in project
        const data = {
            text: "string"
        }
        newProject = await projectController.saveProject(newProject, data);



        // RESULT

        // ensure project ref passed in has new data
        expect(newProject.data["text"]).to.equal("string");
        // re-fetch project form db, ensure it has new data
        await newProject.reload();
        expect(newProject.data["text"]).to.equal("string");
        
    });

    

});
