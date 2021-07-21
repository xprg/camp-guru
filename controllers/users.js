const User=require('../models/user');
const passport=require('passport');



module.exports.new_form=(req,res)=>{
    res.render('user/register');
}

module.exports.create_new_user=async(req,res)=>{

    try{
        console.log("reached here")
        const{username,email,password}=req.body;
        const user=new User({email:email,username:username});
        const registered_user=await User.register(user,password);

        req.login(registered_user,err=>{
           if(err)
          { return next(err);

          }
        req.flash('success',"Welcome fellow Camper");
        return res.redirect('/campgrounds');
        })
    }
    catch(e){
    req.flash('error',e.message);
    res.redirect('/register');
    }
    
    
    
    }


module.exports.render_login_form=(req,res)=>{
    res.render('user/login')
}

module.exports.perform_login=(req,res)=>{

    req.flash('success','Welcome Back!');

    if(req.session.returnTo)
   {const redirectUrl=req.session.returnTo;
    delete req.session.returnTo;
res.redirect(redirectUrl);}
    else{
    res.redirect('/campgrounds');
    }
}

module.exports.logout=(req,res)=>{
    req.logout();
    req.flash('success','successfully logged out');
    res.redirect('/');
}  


