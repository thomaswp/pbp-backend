module.exports = app => {
    let router = require("express").Router();
    // Create a new Tutorial
    router.get("/:id", (req, res) => {
        let id = req.params.id;
        let sampleUser = {
            name: "John Doe " + id,
            email: "jdoe@email.com",
        }
        res.json(sampleUser);
    });
    app.use('/api/v1/users', router);
};