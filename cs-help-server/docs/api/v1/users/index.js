const getUser = require("./get-user");

module.exports = {
  "/users/{id}": {
    // ...updateUser,
    // ...deleteUser,
    ...getUser,
  },
};
