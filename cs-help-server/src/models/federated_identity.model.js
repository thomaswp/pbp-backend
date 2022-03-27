/** This model represents the Federated Identity Schema
 * Provider: google/microsoft, etc
 * Subject: provider id for the user
 * Internal id: id of the user for internal identification
 */

module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      _id: {
        provider: String,
        subject: String,
      },
      internal_id: String,
    },
    { timestamps: true }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const FederatedIdentity = mongoose.model("federatedidentity", schema);
  return FederatedIdentity;
};
