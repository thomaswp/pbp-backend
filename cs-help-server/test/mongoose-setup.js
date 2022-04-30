// test/mongoose-setup.js
const db = require("../src/models");

module.exports = function () {
  beforeEach(async function () {
    // Cleanup federated db
    // console.log("running cleaning");
    await db.federatedidentity.deleteMany({})
    
    // Cleanup user db
    await db.users.deleteMany({})

    await db.projects.deleteMany({})

    await db.assignments.deleteMany({})
  });

  afterEach(async function () {
  });
};
