const fedIDController = require("../controllers/federated_identity.controller");
const userController = require("../controllers/user.controller");
const { logger } = require("../config/logger.config");

exports.loginUser = async (cb, subject, provider, name, email) => {
  logger.debug(
    `loginUser(): name=${name}, email=${email}, provider=${provider}, subject=${subject}`
  );

  const currentFedID = await fedIDController.findFederatedID({
    provider,
    subject,
  });
  logger.debug(
    `loginUser(): Check if account already exists: ${Boolean(currentFedID)}`
  );

  // Check if this login has been seen before
  if (!currentFedID) {
    // If not, create a new account for the user
    return createUser(cb, subject, provider, name, email);
  } else {
    // Return existing user
    const foundUser = await userController.findUser(currentFedID.internal_id);
    logger.debug(
      `loginUser(): found user data: ${foundUser}`
    );

    // if none, complain
    if (!foundUser) {
      logger.error(
        `loginUser(): Something went wrong, user does not exist but federated ID exist. Check DB: ${email}`
      );
      return cb(null, false, {
        message: `loginUser(): Something went wrong when finding existing user`,
      });
    }

    // we're good, go return them
    logger.info(
      `loginUser(): existing user login: ${name} (${email})`
    );
    return cb(null, foundUser)
  }
};

async function createUser(cb, subject, provider, name, email) {

  // Create new user
  const newUser = await userController.createUser({
    name,
    email,
    projects: {},
    templates: [],
  });
  // if new user could not be created, complain
  if (!newUser) {
    const msg = `Something went wrong when creating new user: ${email}`
    logger.error(
      `loginUser(): ${msg}`
    );
    return cb(null, false, {
      message: msg,
    });
  }

  // Create new federated ID
  const newFedID = await fedIDController.createFederatedID({
    provider,
    subject,
    internal_id: newUser.id,
  });
  // if new fed id could not be created, complain
  if (!newFedID) {
    const msg = `Something went wrong when creating new Federated ID: ${email}`
    logger.error(
      `loginUser(): ${msg}`
    );
    return cb(null, false, {
      message: msg,
    });
  }

  // successfully created
  logger.info(
    `createUser(): new user created: ${name} (${email})`
  );
  return cb(null, newUser);
}