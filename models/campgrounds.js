const mongoose=require('mongoose');
const reviews = require('./reviews');

const campgroundSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
},
image:String,
price:{
    type:Number,
    required:true
    
},

description:String,
location:String,

reviews: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Review'

 }],
 provider:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'User'
 }

});

campgroundSchema.post('findOneAndDelete',async(doc)=>{

    if(doc){
        await reviews.deleteMany({_id:{
            $in:doc.reviews
        }})
    }

})

 const Campground=mongoose.model('Campground',campgroundSchema);
module.exports=Campground;

