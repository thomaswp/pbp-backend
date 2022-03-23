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
    // create project
    const assignment_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
    };
    let assignment = await assignmentController.createAssignment(
      assignment_data
    );
    assert.isNotNull(assignmentController.getAssignment(assignment._id));
  });

  it("create an assignment without name", async function () {
    // create project
    const assignment_data = {
      name: "",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
    };
    let assignment = await assignmentController.createAssignment(
      assignment_data
    );
    assert.isFalse(assignment);
  });

  it("create a project copy", async function () {
    // create project
    const assignment_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
    };
    //create second user
    const user2_data = {
      name: "MaryJane",
      email: "mj@ncsu.edu",
      projects: {},
      templates: ["p1_template"],
    };
    user2 = await userController.createUser(user2_data);
    //create assignment
    let assignment = await assignmentController.createAssignment(
      assignment_data
    );
    assert.isNotNull(assignmentController.getAssignment(assignment._id));
    assert.isNotNull(user);
    //copy a project from the assignment
    let projectID = await assignmentController.openAssignment(assignment, user);
    assert.isNotNull(projectID);
    assert.isNotNull(assignment.copies[user._id]);
    //copy a second project from the assignment with a different user
    let project2ID = await assignmentController.openAssignment(
      assignment,
      user2
    );
    assert.isNotNull(project2ID);
    assert.isNotNull(assignment.copies[user2._id]);
    assert.equal(projectID, assignment.copies[user._id]);
    assert.equal(project2ID, assignment.copies[user2._id]);
  });

  it("open an existing project from an assignment", async function () {
    // create project
    const assignment_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
    };
    //create assignment
    let assignment = await assignmentController.createAssignment(
      assignment_data
    );
    assert.isNotNull(assignmentController.getAssignment(assignment._id));
    assert.isNotNull(user);
    //copy a project from the assignment
    let projectID = await assignmentController.openAssignment(assignment, user);
    assert.isNotNull(projectID);
    assert.isNotNull(assignment.copies[user._id]);
    assert.equal(projectID, assignment.copies[user._id]);
    //open an assignment when the user is already stored
    let repeatedProjectID = await assignmentController.openAssignment(
      assignment,
      user
    );
    assert.isNotNull(projectID);
    assert.isNotNull(assignment.copies[user._id]);
    assert.equal(projectID, repeatedProjectID);
    assert.equal(repeatedProjectID, assignment.copies[user._id]);
  });

  it("open an existing project from an assignment that is archived", async function () {
    // create project
    const assignment_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
    };
    //create assignment
    let assignment = await assignmentController.createAssignment(
      assignment_data
    );
    assert.isNotNull(assignmentController.getAssignment(assignment._id));
    assert.isNotNull(user);
    //copy a project from the assignment
    let projectID = await assignmentController.openAssignment(assignment, user);
    assert.isNotNull(projectID);
    assert.isNotNull(assignment.copies[user._id]);
    assert.equal(projectID, assignment.copies[user._id]);
    //Archive project
    project = await projectController.getProject(projectID);
    project = await projectController.setArchived(project, true);
    assert.isTrue(project.isArchived);
    //open an assignment when the user is already stored
    let repeatedProjectID = await assignmentController.openAssignment(
      assignment,
      user
    );
    assert.isNotNull(projectID);
    assert.isNotNull(assignment.copies[user._id]);
    assert.equal(projectID, repeatedProjectID);
    assert.equal(repeatedProjectID, assignment.copies[user._id]);
    project = await projectController.getProject(projectID);
    assert.isFalse(project.isArchived);
  });

  it("try to open an assignment without a name", async function () {
    // create project
    const assignment_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
    };
    //create assignment
    let assignment = await assignmentController.createAssignment(
      assignment_data
    );
    assert.isNotNull(user);
    assignment.name = "";
    //copy a project from the assignment
    let projectID = await assignmentController.openAssignment(assignment, user);
    assert.isFalse(projectID);
    assert.isUndefined(assignment.copies[user._id]);
  });

  it("Returns all assignment present in the database", async function () {
    const assignment_data = {
      name: "Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
    };
    const assignment_data2 = {
      name: "Second Rainfall Problem",
      data: '{"id":"demo@0.1.0","nodes":{"19":{"id":19,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-229.7236328125,-2.266326904296875],"name":"Number"},"20":{"id":20,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[{"node":64,"input":"value","data":{}}]}},"position":[-3.2878192628655256,-171.69686760417676],"name":"Number"},"21":{"id":21,"data":{"output_number":0,"workerResults":{"number":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":0,"parent":null,"children":{}}}}},"inputs":{},"outputs":{"number":{"connections":[]}},"position":[-563.3601395572005,-148.2577078805488],"name":"Number"},"64":{"id":64,"data":{"workerResults":{"current_sum":{"lazy":1,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}},"final_sum":{"lazy":0,"executionTrace":{"context":{"parent":null,"description":"","id":"root"},"value":null,"parent":null,"children":{}}}}},"inputs":{"loop":{"connections":[]},"value":{"connections":[{"node":20,"output":"number","data":{}}]}},"outputs":{"current_sum":{"connections":[]},"final_sum":{"connections":[]}},"position":[332.8209228515625,-200.82662963867188],"name":"Sum"}}}',
    };
    let assignment = await assignmentController.createAssignment(
      assignment_data
    );
    let assignment2 = await assignmentController.createAssignment(
      assignment_data2
    );
    assert.equal(assignment.name, assignment_data.name);
    assert.equal(assignment2.name, assignment_data2.name);

    let assignmentList = await assignmentController.getAllAssignments();
    console.log(assignmentList);
    assert.equal(assignmentList.length, 2);
  });
});
