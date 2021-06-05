const express=require('express');
const router=express.Router({mergeParams:true});
const catchAsync=require('../utils/wrapAsync');
const expressError=require('../utils/errors');
const {campgroundSchema}=require('../validation');
const Campground=require('../models/campgrounds');
const Review=require('../models/reviews');
const{reviewSchema}=require('../validation');

const{validate_review,isLoggedIn}=require('../middleware')


  
  router.post('',isLoggedIn,validate_review,catchAsync(async(req,res)=>{
  
  const campground= await Campground.findById(req.params.id);
  
  const review= new Review(req.body.review);
  review.author=req.user._id;
  await review.save();
  
  campground.reviews.push(review);
  
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
  }))
  
  
  router.delete('/:reviewId',isLoggedIn,catchAsync(async(req,res)=>{
    const{id,reviewId}=req.params;
    const review= await Review.findById(reviewId);
    if(!review.author.equals(req.user._id))
    {
      req.flash('error',"you cant do this operation");
      res.redirect('/');
    }
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}} );
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  }))
  
  module.exports=router;