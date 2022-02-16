const db = require("../models");
const User = db.users;

/**
 * Create a new user
 * @param {*} user
 * @returns User object if suceeded. False if failed
 */
exports.createUser = (user) => {
  if (user.name && user.email) {
    const newUser = new User({
      name: user.name,
      email: user.email,
      projects: user.project,
      templates: user.templates,
    });
    return newUser.save(newUser);
  }
  return false;
};

/**
 * Find a user by ID
 * @param {*} userID
 * @returns User (promise)
 */
exports.findUser = (userID) => {
  return User.findOne({ id: userID });
};

// Return all users
/**
 * Find all user in the database
 * @param {*} req: request object
 * @param {*} res: response object
 */
exports.findAllUser = (req, res) => {
  User.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Failed to find all user",
      });
    });
};


/**
 * Delete an existing user by ID
 * @param {*} userID 
 * @returns deleted User
 */
exports.deleteUser = (userID) => {
  return User.deleteOne({ id: userID }, (err, deletedUser) => {
    if (err) {
      return false;
    } else {
      return deletedUser;
    }
  });
};

// Update a user data
exports.updateUser = (user) => {};
