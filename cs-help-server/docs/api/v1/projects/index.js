const getProject = require("./get-project");
const resetProject = require("./reset-project");

module.exports = {
  "/projects/{id}": {
    ...getProject,
  },
  "/project/reset": {
    ...resetProject,
  },
};
