/** This model represents the User Schema
 * _id: auto-generated ID
 * name: user name
 * email: user email
 * projects: List of project identifier
 * templates: list of project templates
 * */
module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      _id: String,
      name: String,
      email: String,
      projects: Object,
      templates: [String],
    },
    {
      timestamps: true,
      minimize: false,
    }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const User = mongoose.model("user", schema);
  return User;
};
