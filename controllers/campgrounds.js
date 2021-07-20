const open = require('open')
const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');
const {
    cloudinary
} = require('../cloudinary/index')

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbx_token = process.env.mapbox_token
const geocoder = mbxGeocoding({
    accessToken: mbx_token
})



module.exports.index_campgrounds = async (req, res) => { //all  campgrounds
    const allcampgrounds = await Campground.find({});

    res.render('campgrounds/index', {
        allcampgrounds
    });
}


module.exports.new_form = (req, res) => { //new form for new  cg
    res.render('campgrounds/new');

}


module.exports.create_new = async (req, res) => { //saving new cg

    const newcamp = new Campground(req.body.campground);

    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    newcamp.geometry = geodata.body.features[0].geometry

    newcamp.images = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    newcamp.provider = req.user._id;
    console.log(newcamp)
    await newcamp.save();
    req.flash('success', 'Successfully created a campground !');
    res.redirect(`/campgrounds/${newcamp._id}`);
}


module.exports.show_one = async (req, res) => { //campground by id (details)

    const {
        id
    } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: "author"
        }
    }).populate('provider');
    if (!camp) {
        req.flash('error', 'camp not found..')
        return res.redirect('/campgrounds');
    } else {
        res.render('campgrounds/show', {
            camp
        });
    }
}


module.exports.render_edit_form = async (req, res) => {
    const {
        id
    } = req.params; //edit form
    const campground = await Campground.findById(id);

    res.render('campgrounds/edit', {
        campground
    });

}

module.exports.perform_edit = async (req, res) => { //edit then save

    const {
        id
    } = req.params;
    campground = await Campground.findById(id)

    imgs = req.files.map(f => ({
        url: f.path,
        filename: f.filename
    }))
    if (req.body.img_delete === 'delete') {
        for (let file of campground.images) {
            console.log(file)
            await cloudinary.uploader.destroy(file.filename)

        }

        campground.images = imgs;
    } else {
        campground.images.push(...imgs)
    }


    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    campground.geometry = geodata.body.features[0].geometry


    campground.title = req.body.campground.title;
    campground.price = req.body.campground.price;
    campground.description = req.body.campground.description
    campground.location = req.body.campground.location




    const updated = await Campground.findByIdAndUpdate(req.params.id, {
        ...campground
    }, {
        new: true
    });


    res.redirect(`/campgrounds/${updated._id}`);

}


module.exports.delete_campground = async (req, res) => { ///delete campground

    const deleted = await Campground.findByIdAndDelete(req.params.id);


    req.flash('success', 'campground deleted')
    return res.redirect('/campgrounds');


}


module.exports.weather = async (req, res) => { //weather

    const camp = await Campground.findById(req.params.id);
    console.log(camp.geometry.coordinates)
    open(`https://www.windy.com/?${camp.geometry.coordinates[1]},${camp.geometry.coordinates[0]},8`, function(err) {
        if (err)
            throw err;
    });
    res.redirect(`/campgrounds/${camp._id}`);
}