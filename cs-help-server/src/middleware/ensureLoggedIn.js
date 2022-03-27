/**
 * Middleware to check if the user is authenticated.
 * If authenticated, go to the next function
 * Else, return 401 unauhorized response code
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
module.exports = function ensureLoggedIn(req, res, next) {
  if (!req.session.passport?.user) {
    res.status(401);
    res.json({ errMesg: "Unauthenticated" });
  } else {
    next();
  }
};
