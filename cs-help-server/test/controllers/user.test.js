// test/account.test.js
const { expect, assert } = require('chai');
const setup = require("../mongoose-setup");
const userController = require("../../src/controllers/user.controller");


describe("User controller test", function () {
  setup();

  it("create a valid user", async function () {
    const user = {
      name: "JohnDoe",
      email: "jdoe@ncsu.edu",
      projects: [{ name: "p1", id: "0" }],
      templates: ["p1_template"],
    };
    newUser = await userController.createUser(user);
    assert.isNotNull(newUser)
    expect(newUser.name).to.equal(user.name);
    expect(newUser.email).to.equal(user.email);
  });

  it("create a valid user with undefined projects", async function () {
    const user = {
      name: "JohnDoe",
      email: "jdoe@ncsu.edu",
      templates: ["p1_template"],
    };
    newUser = await userController.createUser(user);
    assert.isNotNull(newUser)
    expect(newUser.name).to.equal(user.name);
    expect(newUser.email).to.equal(user.email);
    newUser.projects["01"] = {
      name: "Leeroy",
      isArchived: false,
    };
    newUser.markModified("projects");
    await newUser.save();
    newUser = await userController.findUser(newUser.id);
    assert.isNotNull(newUser.projects);
  });

  it("create an invalid user", async function () {
    let user = {
      email: "jdoe@ncsu.edu",
      projects: [{ name: "p1", id: "0" }],
      templates: ["p1_template"],
    };
    newUser = await userController.createUser(user);
    assert.isFalse(newUser);

    user = {
      name: "john doe",
      projects: [{ name: "p1", id: "0" }],
      templates: ["p1_template"],
    };
    newUser = await userController.createUser(user);
    assert.isFalse(newUser);
  });

  it("find valid user", async function () {
    const user = {
      name: "Friedrich Der Grosse",
      email: "fde@ncsu.edu",
      projects: [{ name: "p1", id: "0" }],
      templates: ["p1_template"],
    };
    newUser = await userController.createUser(user);
    let returnedUser = await userController.findUser(newUser.id);
    assert.equal(returnedUser.id, newUser.id);
    assert.equal(returnedUser.email, newUser.email);
    assert.equal(returnedUser.name, newUser.name);
  });

  it("find invalid user", async function () {
    let returnedUser = await userController.findUser("nonexistendID");
    assert.isNull(returnedUser);
  });

  it("delete invalid user", async function () {
    let res = await userController.deleteUser("nonexistendID");
    assert.isNull(res);
  });

  it("delete valid user", async function () {
    // console.log("starting test");
    const user = {
      name: "Marshal Lannes",
      email: "mlannes@ncsu.edu",
      projects: [{ name: "p1", id: "0" }],
      templates: ["p1_template"],
    };
    // console.log("creating user");
    let newUser = await userController.createUser(user);
    // console.log("deleting user");
    let findedUser = await userController.findUser(newUser.id);
    // console.log(findedUser);
    let res = await userController.deleteUser(newUser.id);

    // console.log("assering not null");
    // console.log(res);
    assert.isNotNull(res);

    // console.log("trying to find deleted user");
    let returnedUser = await userController.findUser(newUser.id);

    // console.log("asserting that is null");
    assert.isNull(returnedUser);

    
  });


});
