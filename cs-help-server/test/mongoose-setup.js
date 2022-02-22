// test/mongoose-setup.js
const db = require("../src/models");

module.exports = function (callback) {
  beforeEach(async function () {
    this.timeout(120000);
    db.url = global.mongoUrl;
    let dbConnectSuccess = await db.mongoose.connect(db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (!dbConnectSuccess) {
      console.log("Cannot connect to the database!", err);
      process.exit();
    }
    console.log("Connected to the database!");
  });

  afterEach(async function () {
    await db.mongoose.disconnect();
  });
};
