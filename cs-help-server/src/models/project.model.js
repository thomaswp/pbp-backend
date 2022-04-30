/** This model represents the Project Schema
 * _id: auto-generated ID
 * name: project name
 * data: rete data for this project
 * owner: this should be user's _id
 * isAssignment: flag for if this project is an assignment
 * isAssignmentCopy: flag for is this project was copied from an assignment
 * isArchived: flag for if this project is archived
 * assignmentId: the assignmentId that this project is associated with if this is an assignmentCopy
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
      custom_blocks: Array,
      block_libs: Array,
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
