const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("../Schema.js")
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const listingController = require("../controllers/listingcontroller.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({storage });






router.route("/")
.get( wrapAsync(listingController.index))
 .post( 
    isLoggedIn,
    upload.single('listing[image]'),
  validateListing,
   wrapAsync(listingController.createListing)

);
 

 //New Route
router.get("/new",isLoggedIn, listingController.newFormrender);
 router.route("/:id")
 .get(
    wrapAsync(listingController.showListing))
    .put(
    isLoggedIn,
     upload.single('listing[image]'),
    // upload.single('listing[image]'),
    validateListing,
    isOwner,
    wrapAsync(listingController.updateListing))
    .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));



 //Show Route
// router.get("/:id", listingController.showListing);
 
//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.editListing));

// //Update Route
// router.put("/:id", 
//   isLoggedIn,
//   isOwner,
//   validateListing,
  
//   wrapAsync(listingController.updateListing));


// //Delete Route
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


module.exports= router;
