const express=require('express');
const User=require('../models/user');
const router=express.Router();
const catchAsync=require('../utils/wrapAsync')
const passport=require('passport');

router.get('/register',(req,res)=>{
    res.render('user/register');
})

router.post('/register',catchAsync(async(req,res)=>{
try{
    console.log("reached here")
    const{username,email,password}=req.body;
    const user=new User({email:email,username:username});
    const registered_user=await User.register(user,password);
    req.login(registered_user,(e)=>{
       if(e)
       return next(e);
    })
    
    req.flash('success',"Welcome to Yelpcamp");
    res.redirect('/campgrounds');
}
catch(e){
req.flash('error',e.message)
res.redirect('/register');
}



}))

router.get('/login',(req,res)=>{
    res.render('user/login');

})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{

    req.flash('success','Welcome Back!');

    if(req.session.returnTo)
   {const redirectUrl=req.session.returnTo;
    delete req.session.returnTo;
res.redirect(redirectUrl);}
    else{
    res.redirect('/campgrounds');
    }
})


router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','successfully logged out');
    res.redirect('/campgrounds');
})



module.exports=router;