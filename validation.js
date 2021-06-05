const joi=require('joi');
                                    //did not work properly



  module.exports.campgroundSchema=joi.object({
        campground:joi.object({

          title:joi.string().required(),
          location :joi.string().required(),
          image:joi.string(),
          price:joi.number().required().min(0),
          description:joi.string().required()
    
        }).required()
      })
     

  module.exports.reviewSchema=joi.object({

    review:joi.object({

      body:joi.string().required(),
      rating:joi.number().required()
    }).required()
  })
