const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req,res, next) => {
    // console.log(req); //stores a lot of information, even the path the user wanted to access
    if(!req.isAuthenticated()){
        //redirect url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create lisiting!")
        return res.redirect("/login");
    }
    next();
};


// we can not save the redirectUrl into req.session as the passport automatically resets the session info after login of an user hence we can 
// store it in the localsName, as passport to not have access to delete the information from there
module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    
        let{id} =  req.params;
        let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currUser._id)){
            req.flash("error", "You are not the owner of this listing!");
            return res.redirect(`/listings/${id}`);
        }
        next();
};

// Listing Validation
module.exports.validateListing = (req, res, next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}


//Review validation
module.exports.validateReview = (req, res, next) =>{
    console.log.apply(req.params.id);
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    
    let{ id, reviewId } =  req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}