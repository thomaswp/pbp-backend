const { GenericContainer } = require("testcontainers");

module.exports.mochaHooks = {
  beforeAll: async function () {
    this.timeout(60 * 10000);
    console.log("test started");
    global.mongoContainer = await new GenericContainer("mongo", "latest")
      .withEnv("MONGO_INITDB_ROOT_USERNAME", "root")
      .withEnv("MONGO_INITDB_ROOT_PASSWORD", "example")
      .withExposedPorts(27017)
      .start();
    console.log("DB created");
    global.mongoUrl = `mongodb://root:example@127.0.0.1:${global.mongoContainer.getMappedPort(
      27017
    )}`;
  },

  afterAll: async function () {
    await global.mongoContainer.stop();
    console.log("Finish unit test");
  },
};
