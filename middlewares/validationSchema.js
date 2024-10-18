
const {body} = require("express-validator");

const validationResultSchema = () => {
       return [
            body("firstName","lastName")
              .notEmpty()
              .isLength({ min: 2 })
              .withMessage("the name at least 2 digits"),
            body("password").notEmpty().withMessage("password is required"),
            ]
    }

    module.exports = { validationResultSchema }