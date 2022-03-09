// test/project.test.js
const { expect, assert } = require('chai');
const setup = require("../mongoose-setup");
const projectController = require("../../src/controllers/project.controller");
const userController = require("../../src/controllers/user.controller");

describe("Project controller test", function () {
  setup();


  // TEST CONFIG

  // Declare some variables used in tests
  let user;     // user to hold projects
  let project;  // project to create/modify

  // Before each test, create a user to hold the projects
  beforeEach("create user to hold projects", async function() {
    const user_data = {
      name: "JohnDoe",
      email: "jdoe@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    user = await userController.createUser(user_data);
  });
  // After each, clear those vars
  afterEach("reset user and project variables", function() {
    user = null;
    project = null;
  });

  // Declare a method that will setup a project
  async function setupProject(
    // arguments with defaults
    name = "Test Project 1",
    owner = user.id,
    data = {}
  ) {
    // create a valid project
    const project_data = {
      name: name,
      data: data,
      owner: owner
    };
    project = await projectController.createProject(project_data, user);
  }


  // TESTS

  it("create a valid project", async function () {

    // SETUP
    



    // ACTION

    // create project
    const project_data = {
      name: "Test Project 1",
      data: {},
      owner: user._id
    };
    project = await projectController.createProject(project_data, user);



    // RESULT

    // ensure return value from createProject is good
    assert.isNotNull(project);
    expect(project.name).to.equal(project_data.name);
    expect(project.owner).to.equal(project_data.owner);
    // re-fecth project, ensure data is still good
    await project.reload();
    assert.isNotNull(project);
    expect(project.name).to.equal(project_data.name);
    expect(project.owner).to.equal(project_data.owner);

    // test that the user ref we pass in args was updated correctly
    expect(user.projects[project.id]).to.equal(project_data.name);
    // re-fetch user, ensure data is still good
    await user.reload();
    expect(user.projects[project.id]).to.equal(project_data.name);
  });





  it("create a invalid project", async function () {
    
    // SETUP


    // ACTION

    // create invalid project, no name
    const project_data = {
      name: "",
      data: {},
      owner: user._id
    };
    project = await projectController.createProject(project_data, user);



    // RESULT

    // project returned should not be valid
    assert.isFalse(project);

  });





  it("find a valid project", async function () {

    // SETUP
    await setupProject();



    // ACTION

    // find project by id
    const retProject = await projectController.getProject(project.id);



    // RESULT

    // expect project data matches
    expect(retProject.name).to.equal(project.name);
    expect(retProject.owner).to.equal(project.owner);
    expect(retProject._id).to.equal(project._id);
  });





  it("rename a project", async function () {

    // SETUP
    await setupProject();



    // ACTION

    // rename the project to something else
    await projectController.renameProject(project, "Test2");



    // RESULT

    // Test update in project
    // expect that project reference passed in has changed its name
    expect(project.name).to.equal("Test2");
    // re-fetch project from db, ensure name is changed
    await project.reload();
    expect(project.name).to.equal("Test2");

    // Test update in user
    // re-fetch user from db, ensure project name changed
    await user.reload();
    expect(project.name).to.equal("Test2");
    expect(user.projects[project._id]).to.equal("Test2");
    
  });





  it("save a project", async function() {
    
    // SETUP
    await setupProject();
    


    // ACTION

    // Create and save new data in project
    const data = {
      text: "string"
    }
    await projectController.saveProject(project, data);



    // RESULT

    // ensure project ref passed in has new data
    expect(project.data["text"]).to.equal("string");
    // re-fetch project form db, ensure it has new data
    await project.reload();
    expect(project.data["text"]).to.equal("string");
    
  });


  it("archive a project", async function() {
    
    // SETUP
    await setupProject();
    // ensure it starts un-archived
    expect(project.isArchived).to.be.false;
    


    // ACTION

    // Archive the project
    await projectController.setArchived(project);



    // RESULT

    // enure project is archived before and after refresh
    expect(project.isArchived).to.be.true;
    await project.reload();
    expect(project.isArchived).to.be.true;
    
  });

  
  it("un-archive a project", async function() {
    
    // SETUP
    await setupProject();
    // archive it
    await projectController.setArchived(project);
    // ensure it starts archived
    expect(project.isArchived).to.be.true;
    


    // ACTION

    // Un-archive the project
    await projectController.setArchived(project, false);



    // RESULT

    // enure project is not archived before and after refresh
    expect(project.isArchived).to.be.false;
    await project.reload();
    expect(project.isArchived).to.be.false;
    
  });

});
