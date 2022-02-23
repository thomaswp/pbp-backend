const { GenericContainer } = require("testcontainers");

module.exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(60 * 10000);
    console.log("test started");
    // global.mongoContainer = await new GenericContainer("mongo", "latest")
    //   .withEnv("MONGO_INITDB_ROOT_USERNAME", "root")
    //   .withEnv("MONGO_INITDB_ROOT_PASSWORD", "example")
    //   .withExposedPorts(27017)
    //   .start();
    // console.log("DB created");
    global.mongoUrl = `mongodb://root:123456@0.0.0.0:7017/cshelp_db?authSource=admin`;
  },

  afterAll: async function () {
    console.log("Finish unit test");
    process.exit();
  },
};
