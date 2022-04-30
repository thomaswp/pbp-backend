const db = require("../models");
const User = db.users;
const { nanoid } = require("nanoid");

/**
 * Create a new user
 * @param {*} user the user object being passed in
 * @returns User object if suceeded. False if failed
 */
exports.createUser = (user) => {
  if (user.name && user.email) {
    const newUser = new User({
      _id: nanoid(),
      name: user.name,
      email: user.email,
      projects: user.projects || {},
      templates: user.templates,
    });
    return newUser.save();
  }
  return false;
};

/**
 * Find a user by ID
 * @param {*} userID the userID to be found in the database
 * @returns User (promise)
 */
exports.findUser = (userID) => {
  return User.findById(userID);
};

/**
 * Find all user in the database
 * @param {*} req: request object
 * @param {*} res: response object
 */
// exports.findAllUsers = (req, res) => {
//   User.find({})
//     .then((data) => {
//       res.send(data);
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Failed to find all user",
//       });
//     });
// };

/**
 * Delete an existing user by ID
 * @param {*} userID the UserID to be deleted
 * @returns deleted User
 */
exports.deleteUser = async (userID) => {
  let res = await User.findByIdAndRemove(userID);
  return res;
};

// Update a user data
// exports.updateUser = (user) => {};
