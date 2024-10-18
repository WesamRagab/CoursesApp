require ('dotenv').config();
const express = require("express");
const path = require('path');
const cors = require ('cors')
const app = express();
const port = 5000;
const mongoose = require ('mongoose');
const httpStatusText = require('./utils/httpStatusTest');

app.use('/uploads',express.static(path.join(__dirname,'uploads')));

console.log( process.env.MONGO_URL);   

const url =process.env.MONGO_URL;

mongoose.connect(url).then(()=>{

  console.log('mongodb Server started');

})

// CORS --> cross origin resource sharing 
app.use(cors());
// lec 7 at 1:06:00 how to connect with frontend (browser)

app.use(express.json()); //or body parser.json to parse the req body that come to you

const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');

//route middleware
app.use('/api/v1/courses',coursesRouter); //localhost / --> /api/courses
app.use('/api/v1/users',usersRouter );  //  /api/users 
//global middleware for not found router

// wildcard(default middleware or routing)
app.all('*', (req , res, next)=>{

  return res.status(404).json({status : httpStatusText.ERROR, message:'This Resource is not Available'});
})

//global error handler
app.use((error,req,res,next)=>{
  res.status( error.statusCode || 500).json({status :error.httpStatusText|| httpStatusText.ERROR, message: error.message , code: error.statusCode || 500 , data : null });
} ); 


app.listen(process.env.PORT || 5001, () => {
  console.log("Server is running");
});


// express validator --> a middleware.. that validate any order you want
//from app to url Called--> Route : Resources and its func (route logic)

// database --> a place that stored and organized and managed Data through it
// database management system --> software interface that end-users,apps and the db
/* {
  "firstName" : "mohamed",
  "lastName"  : "kareem",
  "email" : "mokareem2020@gmail.com",
  "password" : "1234",
  "role" : "admin"

}
  */