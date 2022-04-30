const getUser = require("./get-user");
const getLoggedUser = require("./get-logged-user");

module.exports = {
  "/user": {
    ...getLoggedUser,
  },
  "/users/{id}": {
    ...getUser,
  },
};
