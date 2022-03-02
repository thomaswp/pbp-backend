const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

// return all model instances
db.users = require("./user.model.js")(mongoose);
db.federatedidentity = require("./federated_identity.model.js")(mongoose);
db.projects = require("./project.model.js")(mongoose);

// export db
module.exports = db;
