/**
 * This file create MongoDB URL that the application use
 * This create an abstraction to help user to quickly access database to store data
 */
const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
module.exports = {
  url: `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`,
};
