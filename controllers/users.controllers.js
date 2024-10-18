const asyncWrapper = require('../middlewares/asyncWrapper');
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusTest');
const appError = require('../utils/appError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');


const getAllUsers =  asyncWrapper (async(req, res) => {
    
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({},{"__v" : false , password: false}).limit(limit).skip(skip);
    res.json({status: httpStatusText.SUCCESS , data : {users}});
  });




const register = asyncWrapper(
    async( req,res , next)=>{

        console.log(req.body);
        const { firstName,lastName,email,password,role } = req.body;

        const oldUser = await User.findOne({email: email});

        if (oldUser)
            {
                const error = appError.create('This User Already exists',400,httpStatusText.FAIL);
                return next(error);
            }
        //password hashing
       const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            avatar: req.file.filename
        });
        //generate jwt token
       const token = await generateJWT({email: newUser.email, id: newUser._id , role: newUser.role});
       newUser.token = token;
//    const token = generateJWT({email: newUser.email, id: newUser._id});
// newUser.token = token;

        await newUser.save();


        res.status(201).json({status : httpStatusText.SUCCESS, data: {user : newUser}});

});
  

const login = asyncWrapper( 
    async(req , res , next)=>{
        const {email,password } = req.body;
        if(!email && !password)
            {
                const error = appError.create('Email and Password are Required',400,httpStatusText.FAIL);
                return next(error);
            }
           
            const user = await User.findOne({email: email});
            if(! user){
                const error = appError.create('user is not found',400,httpStatusText.FAIL);
                return next(error);
            }
           
            const matchedPassword = bcrypt.compare(password, user.password);
           
            if(user && matchedPassword)
                {
                    //Logged in Successfully
                    const token =  await generateJWT({email: user.email, id: user._id, role: user.role});

                    res.json({status: httpStatusText.SUCCESS , data : {token}});

                }else{

                const error = appError.create('Something went wrong',500,httpStatusText.ERROR);
                return next(error);
                }


} 
);


module.exports ={
    getAllUsers,
    register,
    login
}
