const express = require("express");
const Listing = require("../models/listing.js");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")  
    .get(wrapAsync(listingController.index))   //Index route
    .post(isLoggedIn, 
        upload.single("listing[image]"), 
        validateListing,
        wrapAsync( listingController.createListing)); //Create route //JOI //file related sab data will be saved

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);
////// NEW CODE ADDED
router.get("/category/:category", wrapAsync(async (req, res) => {
    const { category } = req.params;
    const listings = await Listing.find({ category: category });
    res.json(listings); // Send the listings as JSON response
}));

///////

// Search route
// router.get('/search', async (req, res) => {
//     const query = req.query.title; // Change to title for searching by title

//     try {
//         // Search for listings by title
//         const listings = await Listing.find({
//             title: { $regex: query, $options: 'i' }, // Case-insensitive search
//         });

//         // Render the listings page with the search results
//         res.render('listings', { listings }); // Adjust your view name if necessary
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server Error");
//     }
// });

router.get('/search', async (req, res) => {
    const query = req.query.title; // Use title for searching by title

    try {
        const listings = await Listing.find({
            title: { $regex: query, $options: 'i' }, // Case-insensitive search
        });

        res.json(listings); // Return listings as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
router
    .route("/:id") 
    .get(wrapAsync(listingController.showListing)) // Show route : read operation
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))  //update route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));   //delete route


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderEditForm));



module.exports = router;