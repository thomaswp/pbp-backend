// Import swagger
const swaggerUI = require("swagger-ui-express");
const { isLoggedInAndRedirect } = require("../src/middleware/ensureLoggedIn");

// Import our docs
const v1_docs = require("./api/v1");

// Module exports a lambda, so that it can be require'd and ran like:
// require ('docs')(app);
module.exports = (app) => {
  // Swagger API docs
  app.use(
    "/api/v1",
    isLoggedInAndRedirect,
    swaggerUI.serve,
    swaggerUI.setup(v1_docs)
  );
};
