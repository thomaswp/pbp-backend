const getProject = require("./get-project");

module.exports = {
  "/projects/{id}": {
    ...getProject,
  },
};
