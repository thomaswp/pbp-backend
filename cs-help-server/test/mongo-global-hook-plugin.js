const db = require("../src/models");

module.exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(60 * 10000);
    console.log("test started");
    global.mongoUrl = `mongodb://root:123456@0.0.0.0:7018/cshelp_db_test?authSource=admin`;
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

    // Cleanup federated db
    await db.federatedidentity.deleteMany({})
    // Cleanup user db
    await db.users.deleteMany({})
  },

  afterAll: async function () {
    console.log("reached")
    await db.mongoose.disconnect();
    console.log("Closing database, unit test finished");
    // process.exit();
  },
};
