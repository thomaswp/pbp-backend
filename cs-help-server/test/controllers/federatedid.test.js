// test/account.test.js
const { expect, assert } = require("chai");
const setup = require("../mongoose-setup");
const fedIDCOntroller = require("../../src/controllers/federated_identity.controller");

describe("FederatedID", function () {
  setup();

  it("create a valid FederatedID", async function () {
    const fedId = {
      provider: "google",
      subject: "345b",
      internal_id: "3345",
    };
    let newFedId = await fedIDCOntroller.createFederatedID(fedId);
    assert.isNotFalse(newFedId);
  });

  it("create an invalid empty FederatedID", async function () {
    let fedId = {
      provider: "google",
      subject: "345b",
    };
    let newFedId = await fedIDCOntroller.createFederatedID(fedId);
    assert.isFalse(newFedId);
    fedId = {
      subject: "345b",
      internal_id: "3345",
    };
    newFedId = await fedIDCOntroller.createFederatedID(fedId);
    assert.isFalse(newFedId);
    fedId = {
      provider: "google",
      internal_id: "3345",
    };
    newFedId = await fedIDCOntroller.createFederatedID(fedId);
    assert.isFalse(newFedId);
  });

  it("find a valid FederatedID", async function () {
    const fedId = {
      provider: "google",
      subject: "345b"
    };
    //console.log("Trying to find Fed ID");
    let newFedId = await fedIDCOntroller.findFederatedID(fedId);
    //console.log("Result " + newFedId);
    assert.equal(newFedId?.internal_id, "3345");
  });

  it("find a non-existent FederatedID", async function () {
    const fedId = {
      provider: "microsoft",
      subject: "345b"
    };
    let newFedId = await fedIDCOntroller.findFederatedID(fedId);
    //console.log(newFedId);
    assert.isNull(newFedId);
  });

  it("find a non-existent FederatedID", async function () {
    const fedId = {
      provider: "microsoft",
      subject: "345b"
    };
    let newFedId = await fedIDCOntroller.findFederatedID(fedId);
    //console.log(newFedId);
    assert.isNull(newFedId);
  });

  it("delete non-existent FederatedID", async function () {
    let res = await fedIDCOntroller.deleteFederatedID("ddad");
    assert.isNull(res);
  });

  it("delete existing FederatedID", async function () {
    let res = await fedIDCOntroller.deleteFederatedID("3345");
    assert.isNotNull(res);
  });
});
