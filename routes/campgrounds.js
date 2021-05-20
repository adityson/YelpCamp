const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get('/', catchAsync(async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', {campgrounds});
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req,res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/new', isLoggedIn, (req,res) => {
    res.render('campgrounds/new.ejs');
})


router.get('/:id', catchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Campground does not exist!');
        return res.redirect('/campgrounds');
    }
    console.log(campground);
    res.render('campgrounds/show.ejs', {campground});
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Campground does not exist!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit.ejs', {campground});
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}))


module.exports = router;
