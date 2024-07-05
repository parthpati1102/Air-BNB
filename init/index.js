const mongoose = require("mongoose");
const initdata = require("../init/data.js");
const listing = require("../models/listing.js")
const review = require("../models/review.js")

const MONGO_PASSWORD = encodeURIComponent('parth@123');
const MONGO_URL = `mongodb+srv://parthpatidar11022004:${MONGO_PASSWORD}@cluster0.228w6mw.mongodb.net/MajorProject?retryWrites=true&w=majority&appName=Cluster0`;


main()
.then(() => {
    console.log("Connection Successfull");
}) 
.catch((err) => {
    console.log(err);
})


async function main() {
   await mongoose.connect( MONGO_URL);
}

const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log("Data is Initialized");

    // await review.findByIdAndDelete("665c6f251ac9a9fc298ca40f");
    // console.log("deleted Successfully");
}

initDB();
