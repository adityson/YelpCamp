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
    for(let i=0; i<300; i++){
        const randTh = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '60ae6655764beab47c75e4d8',
            title: `${getTitle(descriptors)} ${getTitle(places)}`,
            location: `${cities[randTh].city}, ${cities[randTh].state}`,
            price,
            description: 'Hello from the campground. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using content here, content here, making it look like readable English.',
            geometry: {
                coordinates: [
                    cities[randTh].longitude,
                    cities[randTh].latitude
                ],
                type: 'Point'
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dunorhqzn/image/upload/v1621615306/YelpCamp/z8rn9gk67yh8giuxw0mr.jpg',
                  filename: 'YelpCamp/hp6ionvpvhouqlwz9rfz'
                },
                {
                  url: 'https://res.cloudinary.com/dunorhqzn/image/upload/v1621696053/YelpCamp/vmqybgq9mqdwixkru5xe.jpg',
                  filename: 'YelpCamp/fcgrgcwywyaa9ercyr59'
                }
              ],
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
