// test/account.test.js
const expect = require("expect");
const setup = require("../mongoose-setup");
const fedIDCOntroller = require("../../src/controllers/federated_identity.controller");

describe("FederatedID", function () {
  setup();

  it("creates a FederatedID", async function () {
    const fedId = {
        provider: "google",
        subject: "345b",
        internal_id: "3345"
    };
    newFedId = await fedIDCOntroller.createFederatedID(fedId);
  });
});
