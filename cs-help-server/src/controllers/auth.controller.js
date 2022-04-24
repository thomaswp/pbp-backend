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

  // Check if federated exist. If not, create new user, otherwise return existing user
  if (!currentFedID) {
    // Create new user
    const newUser = await userController.createUser({
      name,
      email,
      projects: {},
      templates: [],
    });
    if (!newUser) {
      logger.error(
        `loginUser(): Something went wrong when creating new user: ${email}`
      );
      return cb(null, false, {
        message: `Something went wrong when creating user`,
      });
    }
    const newFedID = await fedIDController.createFederatedID({
      provider,
      subject,
      internal_id: newUser.id,
    });
    if (!newFedID) {
      logger.error(
        `loginUser(): Something went wrong when creating new Federated ID: ${email}`
      );
      return cb(null, false, {
        message: `Something went wrong when creating Federated ID`,
      });
    }
    logger.info(
      `loginUser(): new user created: ${name} (${email})`
    );
    return cb(null, newUser);
  } else {
    // Return existing user
    const currentUser = await userController.findUser(
      currentFedID.internal_id
    );
    logger.debug(
      `loginUser(): federated login exists, retrieving user data: ${currentUser}`
    );
    if (!currentUser) {
      logger.error(
        `loginUser(): Something went wrong, user does not exist but federated ID exist. Check DB: ${email}`
      );
      return cb(null, false, {
        message: `loginUser(): Something went wrong when finding existing user`,
      });
    }
    logger.info(
      `loginUser(): existing user login: ${name} (${email})`
    );
    return cb(null, currentUser);
  }
}