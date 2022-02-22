// test/account.test.js
const expect = require("expect");
const setup = require("../mongoose-setup");
const userController = require("../../src/controllers/user.controller");

describe("User", function () {
  setup();

  it("creates a user", async function () {
    const user = {
      name: "JohnDoe",
      email: "jdoe@ncsu.edu",
      projects: [{ name: "p1", id: "0" }],
      templates: ["p1_template"],
    };
    newUser = await userController.createUser(user);
  });
});
