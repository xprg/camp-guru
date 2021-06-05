const Campground=require('./models/campgrounds')
const {campgroundSchema}=require('./validation')
const expressError=require('./utils/errors')
const Review=require('./models/reviews');
const{reviewSchema}=require('./validation');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated())
    {   
       req.session.returnTo= req.originalUrl
        req.flash('error',"You must be logged in");
        res.redirect('/login');
    }
    else{
        next();
    }
}

module.exports.isProvider=async(req,res,next)=>{
    const campground= await Campground.findById(req.params.id);
    if(!(campground.provider.equals(req.user._id)))
    {
      req.flash('error',"You don't have permission for this")
      res.redirect('/');
    }
    next();
}

module.exports.campground_validate=(req,res,next)=>{                   //fucntion to validate camp info...
    const {err}=campgroundSchema.validate(req.campground);
   
    if(err){
      const msg=err.details.map(el=>el.message).join(',');
    const error=new expressError(401,msg);
    
    next(error);}
    else{
      next();
    }
     
   
   }

   module.exports.validate_review=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.review);
    if(error){
      const msg=error.details.map(el=>el.message).join(',');
    const error=new expressError(401,msg);
    }
    next(error);
  }
