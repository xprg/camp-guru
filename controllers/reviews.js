const Campground=require('../models/campgrounds');
const Review=require('../models/reviews');



module.exports.create_new=async(req,res)=>{
  
    const campground= await Campground.findById(req.params.id);
  
    if(campground.provider.equals(req.user._id)){
      req.flash('error','you cannot review your own campground');
      
      
       return res.redirect(`/campgrounds/${campground._id}`);
    }
    
    const review= new Review(req.body.review);
    review.author=req.user._id;
    await review.save();
    
    campground.reviews.push(review);
    
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
    }

module.exports.delete_review=async(req,res)=>{
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
  }