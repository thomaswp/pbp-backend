const postAssignment = require("./post-assignment");
const getAssignments = require("./get-all-assignment");
const openAssignments = require("./open-assignment");
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
};
