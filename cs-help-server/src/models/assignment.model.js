/** This model represents the Assignment Schema
 * _id: auto-generated ID
 * name: Assignment name
 * projectId: id of the project associated with this assignment
 * copies: list of project ids that are copies of this assignment
 **/
module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      _id: String,
      name: String,
      projectId: String,
      copies: Object,
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
  const Assignment = mongoose.model("assignment", schema);
  return Assignment;
};
