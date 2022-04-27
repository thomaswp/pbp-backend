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

/**
 * Middleware to check if the user is authenticated under a specific ID.
 * If authenticated, go to the next function.
 * Else, redirect to login page.
 * @param {*} param either a user_id string or a function
 *    that accepts `req` and returns a user id
 * @returns middleware to handle login check
 */
const ensureLoggedInAs = (param) => {
  var getUser; // function that returns user id

  // if user id passed in, use that directly
  if (typeof param === 'string') {
    getUser = () => param;
  }
  // if middleware passed in, then use that to get user id
  else if (typeof param === 'function') {
    getUser = param;
  }

  // return middleware
  return (req, res, next) => {
    console.log("running ensureLoggedInAs midleware")
    // get user id
    const user_id = getUser(req);
    console.log("user_id=" + user_id);
    console.log("req.user=" + req.user);
    // if user does not match, then cancel the request
    if (req.user._id !== user_id) {
      res.redirect('/login');
    } else {
      // user id matches - move on
      next();
    }
  }
}

module.exports = {
  isLoggedIn: ensureLoggedIn,
  isLoggedInAndRedirect: ensureLoggedInAndRedirect,
  ensureLoggedInAs,
}
