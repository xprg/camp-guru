
if(process.env.NODE_ENV!=="production")
require('dotenv').config();


const express=require('express');
const  mongoose  = require('mongoose');
const path=require('path');
const methodOverride=require('method-override');
const app=express();
const ejsmate=require('ejs-mate');
const catchAsync=require('./utils/wrapAsync');
const expressError=require('./utils/errors')


const camp_router=require("./routes/campground");
const review_router=require('./routes/review');
const user_router=require('./routes/user');


const session=require('express-session');
const flash=require('express-flash');
const passport=require('passport');
const localStratergy=require("passport-local");
const User=require('./models/user');

const mongo_sanitize=require('express-mongo-sanitize')

const MongoStore=require('connect-mongo')




app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongo_sanitize())

const db_url=process.env.db_url||'mongodb://localhost:27017/yelpcamp';

mongoose.connect(db_url,
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




const secret=process.env.secret||"mustbesecret";

session_config={
  store:MongoStore.create({
    mongoUrl:db_url,
    secret:secret,
    touchAfter:24*60*60
    }),

  name:"sid",
  secret:secret,
  resave:'false',
  saveUninitialized:"true",
  cookie:{
httpOnly:'true',
// secure:true,
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

app.use('/campgrounds',camp_router);                                       // all routers
app.use('/campgrounds/:id/review',review_router);
app.use('/',user_router);


app.all('*', (req, res, next) => {
  next(new expressError(404,'Page not found'));
}) 
                                                                          // error handlers
app.use((err,req,res,next)=>{
 console.log(err);
 console.log('LOLOLOLLLLLLOLOOOOOOOOOOOL')
 const{status_code=500}=err;
  if(!err.message){err.message="Something went wrong..please return"}

res.status(status_code).render('campgrounds/error',{err});
})

const port=process.env.PORT||3000;
app.listen(port,()=>{console.log(`listening on ${port}`)});
