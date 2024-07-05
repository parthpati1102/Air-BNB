const express = require("express");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const joi = require("joi");
const  methodOverRide = require("method-override");
const ExpressError = require("./utils/ExpressError.js");

// const { read } = require("fs");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const app = express();
const port = 8081;
const MONGO_PASSWORD = encodeURIComponent('parth@123');
const MONGO_URL = `mongodb+srv://parthpatidar11022004:${MONGO_PASSWORD}@cluster0.228w6mw.mongodb.net/MajorProject?retryWrites=true&w=majority&appName=Cluster0`;


app.set("view engine" , "views");
app.set("views" ,path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverRide("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

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


app.listen(port , (req,res) => {
    console.log(`Server is Listening to Port No. ${port}`);
})


app.get('/', (req, res) => {
    res.send('Welcome')
})

app.use("/listings" , listings);
app.use("/listings/:id/reviews" ,reviews);

app.all('*', (req,res,next) => {
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next) => {
   let {StatusCode=500,message="Something went Wrong!"} = err;
//    res.status(StatusCode).send(message);
     res.status(StatusCode).render("error.ejs",{message});
})

