const db = require("../models");
const FederatedIdentity = db.federatedidentity;

// Create a user
exports.createFederatedID = (federatedID) => {
  const newFedID = new FederatedIdentity({
    provider: federatedID.provider,
    subject: federatedID.subject,
    internal_id: federatedID.internal_id,
  });

  return newFedID.save(newFedID);
};

// Find a user
exports.findFederatedID = (federatedID) => {
  return FederatedIdentity.findOne({
    provider: federatedID.provider,
    subject: federatedID.subject,
  });
};

// Update a user data
exports.updateFederatedID = (federatedID) => {
  if (federatedID) {
    FederatedIdentity.updateOne(
      {
        provider: federatedID.provider,
        subject: federatedID.subject,
      },
      {
        internal_id: federatedID.internal_id,
      }
    );
  }
  return false;
};

// Delete a user
exports.deleteFederatedID = (federatedID) => {
  return FederatedIdentity.deleteOne({
    provider: federatedID.provider,
    subject: federatedID.subject,
  });
};
