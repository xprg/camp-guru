
if(process.env.NODE_ENV!=="production")
require('dotenv').config();


const express=require('express');
const  mongoose  = require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const app=express();
const ejsmate=require('ejs-mate');
const catchAsync=require('./utils/wrapAsync');
const expressError=require('./utils/errors');
const joi=require('joi');
const {campgroundSchema}=require('./validation');
const{reviewSchema}=require('./validation');

const camp_router=require("./routes/campground");
const review_router=require('./routes/review');
const user_router=require('./routes/user');

const Campground=require('./models/campgrounds');
const Review=require('./models/reviews');

const session=require('express-session');
const flash=require('express-flash');
const passport=require('passport');
const localStratergy=require("passport-local");
const User=require('./models/user');



app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));


session_config={
  secret:"mustbesecret",
  resave:'false',
  saveUninitialized:"true",
  cookie:{
httpOnly:'true',
expires: Date.now()+1000*60*60
  }
}
app.use(session(session_config));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.engine('ejs',ejsmate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

mongoose.connect('mongodb://localhost:27017/yelpcamp',
{
useNewUrlParser:'true',
useCreateIndex:'true',
useUnifiedTopology:'true'

});
mongoose.set('useFindAndModify', false);

const db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

app.use(flash());
app.use((req,res,next)=>{
  res.locals.success=req.flash('success');  
  res.locals.error=req.flash('error');
  res.locals.currentUser=req.user;
                                                                            //middleware for flash msg
         next();
})

app.get('/',catchAsync(async(req,res)=>{                  //home
    res.render('home');
}));

app.use('/campgrounds',camp_router);
app.use('/campgrounds/:id/review',review_router);
app.use('/',user_router);


app.use((err,req,res,next)=>{
 console.log(err);
  if(!err.message){err.msg="Something went wrong"}
  else
  {err.msg=err.message}
res.render('campgrounds/error',{err})
})


app.listen(3000,()=>{console.log("listening on 3000")});