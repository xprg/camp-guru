
const mongoose=require('mongoose');
const reviews = require('./reviews');

const opts={toJSON:{virtuals:true}};

const campgroundSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
},
images: [
    {
        url:{
        type:String,
        required:true
            },

    filename:{
        type:String,
        required:true,
    },
}
],

geometry:{

type:{
    type:String,
    enum:["Point"],
    required:true
},
coordinates:{
    type:[Number],
    required:true
}

},


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

},opts);

campgroundSchema.virtual('properties.map_link').get(function(){
      return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
      <p><i>${this.description.substring(0,30)}...</i></p>`
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

