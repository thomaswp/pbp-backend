/**
 * Router to handle User-focused request
 * 
 */
const express = require("express");
let router = express.Router();

router.get('/api/v1/users/:id', (req, res) => {
    let id = req.params.id;
    let sampleUser = {
        name: "John Doe " + id,
        email: "jdoe@email.com",
    }
    res.json(sampleUser);
});

module.exports = router;