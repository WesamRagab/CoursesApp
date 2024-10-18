const mongoose = require('mongoose');
const validator = require('validator');
const userRoles = require('../utils/userRoles')

const userSchema = new mongoose.Schema({
    firstName: {
        type : String,
        required : true,
    },
    lastName: {
        type : String,
        required : true,
    },
    email: {
        type: String ,
        required: true,
        unique: true,
        validate: [validator.isEmail , 'This Field must be a valid Email address']

    },
    password: {
        type: String ,
        require: true,

    },
    token: {
        type: String
    },
   role:{
            type: String,
            enum: [userRoles.USER,userRoles.ADMIN,userRoles.MANAGER],
            default: userRoles.USER

        },
    avatar:{
        type:String,
        default: "uploads/profile.png"
    }    


});



module.exports = mongoose.model('User', userSchema);

