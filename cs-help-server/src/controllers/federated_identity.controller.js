const db = require("../models");
const FederatedIdentity = db.federatedidentity;

/**
 * Create a new Federated ID
 * @param {*} federatedID
 * @returns newly created federated ID (Promise)
 */
exports.createFederatedID = (federatedID) => {
  if (federatedID.provider && federatedID.subject && federatedID.internal_id) {
    const newFedID = new FederatedIdentity({
      _id: {
        provider: federatedID.provider,
        subject: federatedID.subject,
      },
      internal_id: federatedID.internal_id,
    });
    return newFedID.save(newFedID);
  }
  return false;
};

/**
 * Find an existing federated ID using the provider and subject ID
 * @param {*} federatedID: Contains provider and subject
 * @returns FederatedIdentity {provider, subject, internal_id}
 */
exports.findFederatedID = (federatedID) => {
  // console.log(
  //   `findFederatedID: ${federatedID.provider}, ${federatedID.subject}`
  // );
  return FederatedIdentity.findById({
      provider: federatedID?.provider,
      subject: federatedID?.subject
  });
};

/**
 * Update the internal_id of existing FederatedIdentity
 * @param {*} federatedID
 * @returns true if update is successful
 */
// exports.updateFederatedID = (federatedID) => {
//   if (federatedID) {
//     FederatedIdentity.updateOne(
//       {
//         provider: federatedID.provider,
//         subject: federatedID.subject,
//       },
//       {
//         internal_id: federatedID.internal_id,
//       },
//       (err, fedID) => {
//         if (err) {
//           return false
//         }
//         return fedID;
//       }
//     );
//   }
//   return false;
// };

/**
 * Delete an existing FederatedIdentity using internal_id
 * @param {*} internalID: User internal ID
 * @returns Promise whether delete is successful or not successful
 */
exports.deleteFederatedID = async (internalID) => {
  let res = await FederatedIdentity.findOneAndRemove(
    {
      internal_id: internalID,
    }
  );
  return res;
};
