/** This model represents the Assignment Schema
 * ID: auto-generated ID
 * name: Assignment name
 **/
module.exports = (mongoose) => {
  let schema = mongoose.Schema(
    {
      _id: String,
      name: String,
      data: Object,
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
