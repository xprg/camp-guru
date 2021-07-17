
const Campground=require('../models/campgrounds');
const Review=require('../models/reviews');



const mongoose=require('mongoose');
const {cloudinary}=require('../cloudinary/index')



module.exports.index_campgrounds=async(req,res)=>{                    //all  campgrounds
    const allcampgrounds=await Campground.find({});
  
    res.render('campgrounds/index',{allcampgrounds});
  }


module.exports.new_form=(req,res)=>{                 //new form for new  cg
    res.render('campgrounds/new');
  
  }


module.exports.create_new=async(req,res)=>{           //saving new cg
    
    const newcamp=new Campground(req.body.campground);
    console.log(req.files)
    newcamp.images=req.files.map(f=>({url:f.path,filename:f.filename}))
    newcamp.provider=req.user._id;
      
      await newcamp.save();
      req.flash('success','Successfully created a campground !');
      res.redirect(`/campgrounds/${newcamp._id}`);
     }


module.exports.show_one=async(req,res)=>{                //campground by id (details)
   
    const{id}=req.params;
    const camp=await Campground.findById(id).populate({path:'reviews',populate:{path:"author"}}).populate('provider');
    if(!camp)
     {req.flash('error','camp not found..')}
     else{
     res.render('campgrounds/show',{camp});
     }
  }


module.exports.render_edit_form=async(req,res)=>{                  //edit form
    const campground= await Campground.findById(req.params.id)
    if(!campground)
     {req.flash('error','campground not found..please return')}
     else{
      res.render('campgrounds/edit',{campground});
     }
  }

module.exports.perform_edit=async(req,res)=>{                        //edit then save
    const{id}=req.params;

      imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
      campground=await Campground.findById(id)
      
      if(req.body.img_delete==='delete')
      {
        for( let file of campground.images)
        {console.log(file)
         await cloudinary.uploader.destroy(file.filename)
          
        }

        campground.images=imgs;
      }

      else{campground.images.push(...imgs)}
      

    const updated = await Campground.findByIdAndUpdate(req.params.id,{...campground},{new:true});
    
    
    res.redirect(`/campgrounds/${updated._id}`);
    
 }

module.exports.delete_campground=async(req,res)=>{                        ///delete campground
  
    const deleted= await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
  }