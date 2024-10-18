    //  controllers that which putting the Route Handler on it

const {validationResult} = require("express-validator");
const Course= require('../models/course.model');
const httpStatusText = require('../utils/httpStatusTest');
const asyncWrapper = require ('../middlewares/asyncWrapper.js');
const appError = require('../utils/appError.js')

const getAllCourses = asyncWrapper (async(req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const courses = await Course.find({},{"__v" : false}).limit(limit).skip(skip);
  res.json({status: httpStatusText.SUCCESS , data : {courses}});
})

  const getACourse = asyncWrapper(
     async(req, res ,next) => {
        const course = await Course.findById(req.params.id);
      if (!course) {

        const error = appError.create('course not found',404,httpStatusText.FAIL);
        return next(error);
       // return res.status(404).json({status : httpStatusText.FAIL , data: {course: 'course not found'}} )
      }
      return res.json({status : httpStatusText.SUCCESS, data: {course}});
      // try{}catch (err){
      //   return res.status(400).json({status : httpStatusText.ERROR, data: null , message:err.message , code :400});
  
      // }
    }

  )

  const AddCourse = asyncWrapper(
    async(req, res ,next) => {
      //i want to send data to the backend so i will use req.body to write data through it, and parsing the data from "String" to "json"
       const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const error = appError.create(errors.array() ,400,httpStatusText.FAIL);
        return next(error);
        // return res.status(400).json({status : httpStatusText.FAIL , data: errors.array() });
      }
  
      const course = new Course (req.body);
  
      await course.save();
  
      res.status(201).json({status : httpStatusText.SUCCESS, data: {course : course}});
    }
  )

  const updateCourse = asyncWrapper(
    async (req, res) => {
      const id = req.params.id;
      const course = await Course.findByIdAndUpdate(id ,{$set :{ ...req.body}});
      return res.status(200).json({status : httpStatusText.SUCCESS, data: {course : course}});

      // course = { ...course, ...req.body };
      // i used "merging two objects technique .. that the new value override the old one"
     
    }
  )

  const deleteCourse = asyncWrapper(
    async(req, res) => {
    const result = await Course.deleteOne({_id : req.params.id});
    //or use splice function
    res.status(200).json({ status : httpStatusText.SUCCESS , data : null });
  }
)

  module.exports = {
    getAllCourses,
    getACourse,
    AddCourse,
    updateCourse,
    deleteCourse
  }

  