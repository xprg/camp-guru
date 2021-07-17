const express=require('express');
const passport=require('passport')
const router=express.Router();
const catchAsync=require('../utils/wrapAsync')
const{new_form,create_new_user,render_login_form,perform_login,logout}=require('../controllers/users')





router.get('/register',new_form)

router.post('/register',catchAsync(create_new_user))

router.get('/login',render_login_form)

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),perform_login)


router.get('/logout',logout)



module.exports=router;