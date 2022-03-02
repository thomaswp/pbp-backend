// test/mongoose-setup.js
const db = require("../src/models");

module.exports = function () {
  beforeEach(async function () {
    // Cleanup federated db
    // console.log("running cleaning");
    db.federatedidentity.deleteMany({}, (err) => {
      if(err)
        console.log("Failed to delete all fedID");
    })
    // Cleanup user db
    db.users.deleteMany({}, (err) => {
      if(err)
        console.log("Failed to delete all user");
    })
    db.projects.deleteMany({}, (err) => {
      if(err)
        console.log("Failed to delete all projects");
    })
  });

  afterEach(async function () {
  });
};
