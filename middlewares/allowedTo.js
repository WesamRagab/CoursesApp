const appError = require('../utils/appError')

module.exports = (...roles)=>{
     //   (...roles) return array of results ---> ['ABMIN', 'MANAGER']
    return (req,res,next)=>{
        if(!roles.includes(req.user.role))
        {
            return next(appError.create('This role is not authorized',401));
        }
        next();
    }
}