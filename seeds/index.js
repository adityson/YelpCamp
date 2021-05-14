const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const {places, descriptors} = require('./seedHelpers.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected!!");
})

const getTitle = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<50; i++){
        const randTh = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            title: `${getTitle(descriptors)} ${getTitle(places)}`,
            location: `${cities[randTh].city}, ${cities[randTh].state}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
