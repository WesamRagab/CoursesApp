const express = require('express');

const router = express.Router();
const appError = require ('../utils/appError.js');

const multer = require('multer');

const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log('FILE',file);
        cb(null ,'uploads');
    },
    filename: function(req,file,cb) {   
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb )=>{
    const imageType = file.mimetype.split('/')[0];
    if(imageType ==='image'){
        return cb(null, true);
    }else {
        return cb(appError.create('File must be an image',400),false);
    }
}

const upload = multer({
    storage:diskStorage,
    fileFilter
});

const usersControllers = require ('../controllers/users.controllers.js')
const  verifyToken = require('../middlewares/verifyToken.js');

//profile api
router.route("/")
            .get(verifyToken, usersControllers.getAllUsers);

router.route("/register")           
            .post(upload.single('avatar'),usersControllers.register); 

router.route("/login")           
            .post(usersControllers.login);

module.exports = router;   



