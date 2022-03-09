const dbConfig = require("../config/db.config.js");
const mongoose = require("mongoose");

// configure mongoose to use standard JS promise
mongoose.Promise = global.Promise;

// add a new method on every Model called "reload" which refreshes from db
// taken from:
// https://github.com/Automattic/mongoose/issues/7781#issuecomment-929101197
const reloadRecord = function reloadRecord(schema) {
  schema.methods.reload = async function() {
    const record = await this.constructor.findById(this); 
    Object.assign(this, record);
    return record;
  }
}
mongoose.plugin(reloadRecord);


const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

// return all model instances
db.users = require("./user.model.js")(mongoose);
db.federatedidentity = require("./federated_identity.model.js")(mongoose);
db.projects = require("./project.model.js")(mongoose);

// export db
module.exports = db;
