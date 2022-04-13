/**
 * Middleware to check if the user is authenticated.
 * If authenticated, go to the next function
 * Else, return 401 unauhorized response code
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function ensureLoggedIn(req, res, next) {
  if (!req.session.passport?.user) {
    res.status(401);
    res.json({ errMesg: "Unauthenticated" });
  } else {
    next();
  }
};

/**
 * Middleware to check if the user is authenticated.
 * If authenticated, go to the next function
 * Else, redirect to login page
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function ensureLoggedInAndRedirect(req, res, next) {
  if (!req.session.passport?.user) {
      res.redirect('/login')
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn: ensureLoggedIn,
  isLoggedInAndRedirect: ensureLoggedInAndRedirect
}
