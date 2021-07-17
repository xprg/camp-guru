const mongoose=require('mongoose');
const Campground=require('../models/campgrounds');
const cities=require('./cities');
const {descriptors ,places}=require('./seedhelp');


mongoose.connect('mongodb://localhost:27017/yelpcamp',
{
useNewUrlParser:'true',
useCreateIndex:'true',
useUnifiedTopology:'true'
});

const db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

const seedit=async()=> {

await Campground.deleteMany({});

const sample=(arr)=>{ return arr[Math.floor(Math.random()*arr.length)];
}


for( i=0;i<15;i++)
{
  let city=cities[Math.floor(Math.random()*1000)];
  let price=Math.floor(Math.random()*100);
let camp= new Campground({title:`${sample(descriptors)} ${sample(places)}`,price:price,description:"Its a great camp site with a great experience", location:`${city.city},${city.state}`,provider:"60a9ffb5b8af6f110ca7c15b"});
camp.images=
[
  {

    url: 'https://res.cloudinary.com/dip5s2gka/image/upload/v1626538838/yelpcamp/zcpupr6qfmpb6h6t7j8k.jpg',

    filename: 'yelpcamp/zcpupr6qfmpb6h6t7j8k'
  },
  {

    url: 'https://res.cloudinary.com/dip5s2gka/image/upload/v1626538838/yelpcamp/fuqn7ej452zchvbqdeuo.jpg',
  
    filename: 'yelpcamp/fuqn7ej452zchvbqdeuo'
  }
]

await camp.save();
}
console.log("done...");
}

seedit();
