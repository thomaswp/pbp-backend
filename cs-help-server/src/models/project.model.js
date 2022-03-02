/** This model represents the Project Schema
 * ID: auto-generated ID
 * name: project name
 **/
module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      _id: String,
      name: String,
      data: {},
    },
    { timestamps: true }
  );
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });
  const Project = mongoose.model("project", schema);
  return Project;
};
