const db = require("../models");
const User = db.users;

// Create a user
exports.createUser = (user) => {
  const newUser = new User({
    name: user.name,
    email: user.email,
    projects: user.project,
    templates: user.templates,
  });

  return newUser.save(newUser);
};

// Find a user
exports.findUser = (userID) => {
  return User.findOne({ id: userID });
};

// Return all users
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

// Delete a user
exports.deleteUser = (userID) => {
  return User.deleteOne({ id: userID.toHexString() });
};

// Update a user data
exports.updateUser = (user) => {};
