const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/wrapAsync');

const multer=require('multer')
const{storage}=require('../cloudinary/index')

const upload=multer({storage})



const {isLoggedIn,isProvider,campground_validate}=require('../middleware');

const { index_campgrounds,new_form,create_new,show_one,render_edit_form,perform_edit,delete_campground } = require('../controllers/campgrounds');







router.get('',catchAsync(index_campgrounds));
  

router.get('/new',isLoggedIn,new_form)
  
  

 router.post('/newcreate',isLoggedIn,upload.array('image'),campground_validate,catchAsync(create_new))

   
  router.get('/:id',catchAsync(show_one))
      
  router.get('/:id/edit',isLoggedIn,isProvider,catchAsync(render_edit_form))
  
  router.put('/:id/edit',isProvider,upload.array('images'),campground_validate,catchAsync(perform_edit));
  
  
  router.get('/:id/delete',isProvider,catchAsync(delete_campground));
  
  module.exports=router;