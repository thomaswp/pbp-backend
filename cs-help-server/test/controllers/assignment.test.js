// test/project.test.js
const { expect, assert } = require("chai");
const setup = require("../mongoose-setup");
const projectController = require("../../src/controllers/project.controller");
const userController = require("../../src/controllers/user.controller");
const assignmentController = require("../../src/controllers/assignment.controller");

describe("Assignment controller test", function () {
  setup();

  // TEST CONFIG

  // Declare some variables used in tests
  let user; // user to hold projects
  let project; // project to create/modify
  let assignment; //assignment template

  // Before each test, create a user to hold the projects
  beforeEach("create user to hold projects", async function () {
    const user_data = {
      name: "JohnDoe",
      email: "jdoe@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    user = await userController.createUser(user_data);
  });
  // After each, clear those vars
  afterEach("reset user and project variables", function () {
    user = null;
    project = null;
    assignment = null;
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
      owner: owner,
    };
    project = await projectController.createProject(project_data, user);
  }

  // TESTS

  it("create an assignment", async function () {
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project = await projectController.createProject(project_data, user);
    // create Assignment
    let assignment = await assignmentController.createAssignment(project._id);
    assert.isNotFalse(assignmentController.getAssignment(assignment._id));
    assert.equal(assignment.copies[user._id], project._id);
  });

  it("will not create an assignment without a project template", async function () {
    // create Assignment
    let assignment = await assignmentController.createAssignment(
      "nonexistent id"
    );
    assert.isFalse(assignment);
  });

  it("will not create a duplicate assignment", async function () {
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project = await projectController.createProject(project_data, user, true);
    // create Assignment
    let assignment = await assignmentController.createAssignment(project._id);
    assert.isFalse(assignment);
  });

  it("create a project from assignment", async function () {
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user2 = await userController.createUser(user2_data);
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user2._id,
    };
    project = await projectController.createProject(project_data, user2);
    //create assignment
    let assignment = await assignmentController.createAssignment(project._id);
    assert.isNotFalse(assignment);
    //copy a project from the assignment
    let projectID = await assignmentController.openAssignment(
      assignment,
      user._id
    );
    let projectFromAssignment = await projectController.getProject(projectID);
    //console.log(projectFromAssignment)
    assert.equal(projectFromAssignment.assignmentId, assignment._id);
    assert.isNotNull(projectID);
    assert.isNotNull(assignment.copies[user._id]);
    //copy a second project from the assignment with a different user
    let project2ID = await assignmentController.openAssignment(
      assignment,
      user2._id
    );
    assert.isNotNull(project2ID);
    assert.isNotNull(assignment.copies[user2._id]);
    assert.equal(projectID, assignment.copies[user._id]);
    assert.equal(project2ID, assignment.copies[user2._id]);
  });

  it("open an existing project from an assignment", async function () {
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user2 = await userController.createUser(user2_data);
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project = await projectController.createProject(project_data, user);
    //create assignment
    let assignment = await assignmentController.createAssignment(project._id);
    assert.isNotNull(assignmentController.getAssignment(assignment._id));
    //copy a project from the assignment
    let projectID = await assignmentController.openAssignment(
      assignment,
      user._id
    );
    assert.isNotNull(projectID);
    assert.isNotNull(assignment.copies[user._id]);
    assert.equal(projectID, assignment.copies[user._id]);
    assert.equal(projectID, project._id);
    //open an assignment for the second user
    let repeatedProjectID = await assignmentController.openAssignment(
      assignment,
      user2._id
    );
    assert.isNotNull(repeatedProjectID);
    assert.isNotNull(assignment.copies[user2._id]);
    assert.equal(repeatedProjectID, assignment.copies[user2._id]);
  });

  it("open an existing project from an assignment that is archived", async function () {
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user2 = await userController.createUser(user2_data);
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Archive Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project = await projectController.createProject(project_data, user);
    //create assignment
    let assignment = await assignmentController.createAssignment(project._id);
    assert.isNotNull(assignmentController.getAssignment(assignment._id));
    //copy a project from the assignment
    let projectID = await assignmentController.openAssignment(
      assignment,
      user2._id
    );
    assert.isNotNull(projectID);
    assert.isNotNull(assignment.copies[user2._id]);
    assert.equal(projectID, assignment.copies[user2._id]);
    //Archive project
    project = await projectController.getProject(projectID);
    project = await projectController.setArchived(project, true);
    assert.isTrue(project.isArchived);
    //open an assignment when the user is already stored
    let repeatedProjectID = await assignmentController.openAssignment(
      assignment,
      user2._id
    );
    assert.equal(repeatedProjectID, projectID);
    assert.equal(repeatedProjectID, assignment.copies[user2._id]);
    project = await projectController.getProject(repeatedProjectID);
    assert.isFalse(project.isArchived);
  });

  it("Returns all assignment present in the database", async function () {
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user2 = await userController.createUser(user2_data);
    // Create project as assignment template
    const project_data = {
      name: "Rainfall All Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    const project_data2 = {
      name: "Rainfall All Problem 2",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user2._id,
    };
    project = await projectController.createProject(project_data, user);
    project2 = await projectController.createProject(project_data2, user2);
    //create assignment
    let assignment = await assignmentController.createAssignment(project._id);
    let assignment2 = await assignmentController.createAssignment(project2._id);
    assert.isNotNull(assignmentController.getAssignment(assignment._id));
    assert.isNotNull(assignmentController.getAssignment(assignment2._id));
    assert.equal(assignment.name, project_data.name);
    assert.equal(assignment2.name, project_data2.name);

    let assignmentList = await assignmentController.getAllAssignments();
    assert.equal(assignmentList.length, 2);
  });

  it("Rename assignment correctly", async function () {
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user2 = await userController.createUser(user2_data);
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Rename Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project = await projectController.createProject(project_data, user);
    //create assignment
    let assignment = await assignmentController.createAssignment(project._id);
    // change project name
    let newProject = await projectController.renameProject(
      project,
      "Rainfall Renamed"
    );
    // Change assignment name
    //console.log(newProject);
    let newAssignment = await assignmentController.renameAssignment(newProject);
    //console.log(newAssignment);
    assert.equal(newAssignment.name, newProject.name);
  });

  it("Delete assignment correctly", async function () {
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user2 = await userController.createUser(user2_data);
    const user3_data = {
      name: "MaryJane 3",
      email: "mj3@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user3 = await userController.createUser(user3_data);
    const user4_data = {
      name: "MaryJane 4",
      email: "mj4@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user4 = await userController.createUser(user4_data);
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Rename Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project = await projectController.createProject(project_data, user);
    //create assignment
    let assignment = await assignmentController.createAssignment(project._id);
    // Create projects from assignment
    let ProjectID2 = await assignmentController.openAssignment(
      assignment,
      user2._id
    );
    let ProjectID3 = await assignmentController.openAssignment(
      assignment,
      user3._id
    );
    let ProjectID4 = await assignmentController.openAssignment(
      assignment,
      user4._id
    );
    let P2BeforeDelete = await projectController.getProject(ProjectID2);
    // Delete assignment
    let deletedAssignment = await assignmentController.deleteAssignment(
      assignment
    );
    //console.log(newAssignment);
    assert.equal(deletedAssignment.name, assignment.name);
    assert.equal(P2BeforeDelete.assignmentId, assignment._id);
    assert.isTrue(P2BeforeDelete.isAssignmentCopy);
    // get all assignment
    let assignmentList = await assignmentController.getAllAssignments();
    assert.equal(assignmentList.length, 0);

    // make sure that all project copies are disconneted
    let P2 = await projectController.getProject(ProjectID2);
    let P3 = await projectController.getProject(ProjectID3);
    let P4 = await projectController.getProject(ProjectID4);
    assert.equal(P2.assignmentId, "");
    assert.equal(P3.assignmentId, "");
    assert.equal(P4.assignmentId, "");
    assert.isFalse(P2.isAssignmentCopy);
    assert.isFalse(P3.isAssignmentCopy);
    assert.isFalse(P4.isAssignmentCopy);
  });

  it("Delete assignment with invalid project", async function () {
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user2 = await userController.createUser(user2_data);
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Rename Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project = await projectController.createProject(project_data, user);
    //create assignment
    let assignment = await assignmentController.createAssignment(project._id);
    assignment.projectId = "invalidID";
    assignment.save();
    // Delete assignment
    let deletedAssignment = await assignmentController.deleteAssignment(
      assignment
    );
    //console.log(newAssignment);
    assert.isFalse(deletedAssignment);
    // get all assignment
    let assignmentList = await assignmentController.getAllAssignments();
    assert.equal(assignmentList.length, 1);
  });

  it("Reset project with latest assignment data", async function () {
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    let user2 = await userController.createUser(user2_data);
    // Create project as assignment template
    const project_data = {
      name: "Rainfall Rename Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project = await projectController.createProject(project_data, user);
    //create assignment
    let assignment = await assignmentController.createAssignment(project._id);
    // open assignment
    let ProjectID2 = await assignmentController.openAssignment(
      assignment,
      user2._id
    );
    // Update original project assignment template
    project.data = "Updated Data";
    user.markModified("data");
    await project.save();
    // reset the created project
    let resetProject = await projectController.getProject(ProjectID2);
    let newResetProject = await assignmentController.resetAssignmentProject(
      resetProject
    );
    assert.isNotNull(newResetProject);
    assert.equal(newResetProject.data, project.data);

    // Reset project not come from assignment
    const project_data2 = {
      name: "Rainfall Rename Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
      owner: user._id,
    };
    project2 = await projectController.createProject(project_data2, user);
    let newResetProject2 = await assignmentController.resetAssignmentProject(
      project2
    );
    assert.isFalse(newResetProject2);
  });
});
