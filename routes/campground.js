const express=require('express');
const router=express.Router();
const catchAsync=require('../utils/wrapAsync');
const expressError=require('../utils/errors');
const {campgroundSchema}=require('../validation');
const Campground=require('../models/campgrounds');
const Review=require('../models/reviews');

const{reviewSchema}=require('../validation');
const mongoose=require('mongoose');
const flash=require('express-flash');

const {isLoggedIn,isProvider,campground_validate}=require('../middleware');


router.use(flash());



router.get('',catchAsync(async(req,res)=>{                    //all  campgrounds
    const allcampgrounds=await Campground.find({});
  
    res.render('campgrounds/index',{allcampgrounds});
  }));
  
  router.get('/new',isLoggedIn,(req,res)=>{                 //new form for new  cg
    res.render('campgrounds/new');
  
  })
  
  


 router.post('/newcreate',isLoggedIn,campground_validate,catchAsync(async(req,res)=>{           //saving new cg
    
   const newcamp=new Campground(req.body.campground);
     newcamp.provider=req.user._id;
     
     await newcamp.save();
     req.flash('success','Successfully created a campground !');
     res.redirect(`/campgrounds/${newcamp._id}`);
    }
  ))
  
  
  router.get('/:id',catchAsync(async(req,res)=>{                //campground by id (details)
   
    const{id}=req.params;
    const camp=await Campground.findById(id).populate({path:'reviews',populate:{path:"author"}}).populate('provider');
    if(!camp)
     {req.flash('error','camp not found..')}
     else{
     res.render('campgrounds/show',{camp});
     }
  }))
      
  router.get('/:id/edit',isLoggedIn,isProvider,catchAsync(async(req,res)=>{                  //edit form
    const campground= await Campground.findById(req.params.id)
    if(!campground)
     {req.flash('error','please refill the form')}
     else{
      res.render('campgrounds/edit',{campground});
     }
  }))
  
  router.put('/:id/edit',isProvider,campground_validate,catchAsync(async(req,res)=>{                        //edit then save
     const{id}=req.params;
     if(mongoose.Types,mongoose.isValidObjectId(id))
     {
       
     const updated = await Campground.findByIdAndUpdate(req.params.id,{...req.body.campground},{new:true});
     
     
     res.redirect(`/campgrounds/${updated._id}`);
     }
  }));
  
  
  router.get('/:id/delete',isProvider,catchAsync(async(req,res)=>{                        ///delete campground
  
    const deleted= await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
  }));
  
  module.exports=router;