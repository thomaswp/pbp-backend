/** This model represents the Project Schema
 * ID: auto-generated ID
 * name: project name
 * owner: this should be user's _id
 **/
module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      _id: String,
      name: String,
      data: Object,
      owner: String,
      isAssignment: { type: Boolean, default: false },
      isAssignmentCopy: { type: Boolean, default: false },
      isArchived: {
        type: Boolean,
        default: false,
      },
      assignmentId: { type: String, default: "" },
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
  const Project = mongoose.model("project", schema);
  return Project;
};
