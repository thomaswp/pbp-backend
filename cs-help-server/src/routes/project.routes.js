/**
 * Router to handle project-focused request
 *
 */
const express = require("express");


let router = express.Router();
const userController = require("../controllers/user.controller");
const projectController = require("../controllers/project.controller");

router.post("/api/v1/project", async (req, res) => {
    // console.log("running post call");
    // console.log(req);
    // console.log(req.body.name);
    let projname = req.body.name;
    let currentUser = await userController.findUser(req.session.passport?.user);
    const project = {
        name: projname,
        user: currentUser
    };
    let returnedProject = await projectController.createProject(project);
    console.log(returnedProject);
    res.json(currentUser);
});

module.exports = router;