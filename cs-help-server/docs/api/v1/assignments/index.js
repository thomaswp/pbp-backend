const postAssignment = require("./post-assignment");
const getAssignments = require("./get-all-assignment");
const openAssignments = require("./open-assignment");
const deleteAssignment = require("./delete-assignment");
module.exports = {
  "/assignment": {
    ...getAssignments,
  },
  "/insert/assignment": {
    ...postAssignment,
  },
  "/open/assignment": {
    ...openAssignments,
  },
  "/assignment/{id}": {
    ...deleteAssignment,
  },
};
