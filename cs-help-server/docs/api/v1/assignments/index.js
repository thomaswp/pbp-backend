const postAssignment = require("./post-assignment");

module.exports = {
  "/insert/assignments": {
    // ...updateUser,
    // ...deleteUser,
    ...postAssignment,
  },
};
