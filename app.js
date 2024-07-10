if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}


const express = require("express");
const ejsMate = require("ejs-mate");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const joi = require("joi");
const methodOverRide = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


// const { read } = require("fs");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const app = express();
const port = 8081;
const MONGO_PASSWORD = encodeURIComponent('parth@123');
const MONGO_URL = `mongodb+srv://parthpatidar11022004:${MONGO_PASSWORD}@cluster0.228w6mw.mongodb.net/MajorProject?retryWrites=true&w=majority&appName=Cluster0`;
const secretCode = process.env.SECRET;

const store = MongoStore.create({
    mongoUrl : MONGO_URL,
    crypto : {
        secret : secretCode
    },
    touchAfter : 24 * 60 * 60,
});

store.on("error" ,() => {
    console.log("ERROR in MONGO SESSSION STORE" , error)
})

const sessionOptions = {
    store,
    secret : secretCode,
    resave : false , 
    saveUninitialized : true,
    cookie : {
        expire : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}




app.set("view engine", "views");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



main()
    .then(() => {
        console.log("Connection Successfull");
    })
    .catch((err) => {
        console.log(err);
    })


async function main() {
    await mongoose.connect(MONGO_URL);
}


app.listen(port, (req, res) => {
    console.log(`Server is Listening to Port No. ${port}`);
})


// app.get('/', (req, res) => {
//     res.send('Welcome')
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;
   next();
})

// app.get("/demouser" , async(req,res) => {
//     let fakeUser = new User({
//         email : "parthpatidar213@gmail.com",
//         username : "parthpatidar1102"
//     });

//    let registerdUser =  await User.register(fakeUser , "helloparth");
//    res.send(registerdUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" ,userRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { StatusCode = 500, message = "Something went Wrong!" } = err;
    //    res.status(StatusCode).send(message);
    res.status(StatusCode).render("error.ejs", { message });
})

