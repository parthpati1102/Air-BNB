const express = require("express");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const  methodOverRide = require("method-override");
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

// app.get("/sampletest", async (req,res) => {
//     const samplelisting = new listing({
//         title : "My New Villa",
//         description : "By the Beach",
//         price : 100000,
//         location : "Calangute,Goa",
//         country : "India"
//     })

//     await samplelisting.save()
//     console.log("Sample saved Successfully");
//     res.send("Sucessfull testing");
// })

//Index Route
app.get("/listings" , async (req,res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs" , {allListings});
})

//Create Route
app.get("/listings/new" , (req,res) => {
    res.render("listings/new.ejs");
})

//Show Route
app.get("/listings/:id" , async(req,res) => {
      let {id} = req.params;
     const listing  = await Listing.findById(id);
     res.render("listings/show.ejs" , {listing});
})

//Create Route
app.post("/listings", async(req,res) => {
     const newlisting = new Listing(req.body.listing);
     await newlisting.save();
     res.redirect("/listings");
})

//Edit Route
app.get("/listings/:id/edit" , async (req,res) => {
    let {id} = req.params;
    const listing  = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
})

//update Route 
app.put("/listings/:id" ,async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete Route
app.delete("/listings/:id" , async(req,res) => {
      let {id} = req.params;
     await Listing.findByIdAndDelete(id);
      res.redirect("/listings");
})

