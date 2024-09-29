const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js")

//Reviews
// Post Review Route : only post as we wont ever be accessing reviews individually, but only with listing 
router.post ("/", validateReview, isLoggedIn, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));



module.exports = router;

