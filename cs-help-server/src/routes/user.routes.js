/**
 * Router to handle User-focused request
 * 
 */
const express = require("express");
const ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
let router = express.Router();
let ensureLoggedIn = ensureLogIn();

router.get('/api/v1/users/:id', ensureLoggedIn, (req, res) => {
    let id = req.params.id;
    let sampleUser = {
        name: "John Doe " + id,
        email: "jdoe@email.com",
        session: req.session.passport.user
    }
    res.json(sampleUser);
});

module.exports = router;