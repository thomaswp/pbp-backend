// import other modules to use
const basicInfo = require('./basicInfo');
const servers = require('./servers');
const components = require('./components');
const tags = require('./tags');
// Import endpoints from specific categories
const users = require('./users');

// spread all of these modules into a single object containing all API docs
module.exports = {
    ...basicInfo,
    ...servers,
    ...components,
    ...tags,
    ...users
};