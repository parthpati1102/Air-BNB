const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingcontroller = require("../controllers/listings.js");


router.route("/")
.get(wrapAsync(listingcontroller.index))
.post(isLoggedIn,
      upload.single('listing[image]'),
      validateListing,
      wrapAsync(listingcontroller.createListing)
)


//Create Route
router.get("/new" ,isLoggedIn, listingcontroller.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingcontroller.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingcontroller.deleteListing))


//Edit Route
router.get("/:id/edit" ,isLoggedIn,isOwner,
 wrapAsync(listingcontroller.editListng)
);



module.exports = router;