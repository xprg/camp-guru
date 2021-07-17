const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/wrapAsync');



const{validate_review,isLoggedIn}=require('../middleware');
const { create_new,delete_review } = require('../controllers/reviews');


  
  router.post('',isLoggedIn,validate_review,catchAsync(create_new))
  
  
  router.delete('/:reviewId',isLoggedIn,catchAsync(delete_review))
  
  module.exports=router;