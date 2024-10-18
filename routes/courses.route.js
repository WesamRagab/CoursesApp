const express = require('express');

const {body} = require("express-validator");

const router = express.Router();

const coursesControllers = require('../controllers/courses.controllers.js');
const {validationResultSchema} = require('../middlewares/validationSchema');
const  verifyToken = require('../middlewares/verifyToken.js');
const userRoles = require('../utils/userRoles')
const allowedTo = require('../middlewares/allowedTo.js')
//app.route ()--> you can composed more methods one routes 

router.route("/")
            .get(coursesControllers.getAllCourses)
            .post(verifyToken,allowedTo(userRoles.MANAGER),validationResultSchema(),coursesControllers.AddCourse); 

router.route("/:id")
           .get(coursesControllers.getACourse)
           .patch(coursesControllers.updateCourse)
           .delete(verifyToken,allowedTo(userRoles.ADMIN,userRoles.MANAGER),coursesControllers.deleteCourse);

module.exports = router;   