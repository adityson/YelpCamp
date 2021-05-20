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
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '60a6bbe7f655eb4226cd6ff7',
            title: `${getTitle(descriptors)} ${getTitle(places)}`,
            location: `${cities[randTh].city}, ${cities[randTh].state}`,
            image: 'https://source.unsplash.com/collection/483251/',
            price: price,
            description: 'Hello from the campground. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using content here, content here, making it look like readable English.'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
