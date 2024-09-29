const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");



router
    .route("/signup") 
    .get(userController.renderSignUpForn)
    .post(wrapAsync(userController.signUp));


router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl, 
        passport.authenticate("local", { 
            failureRedirect: "/login", 
            failureFlash: true  
        }), 
        userController.login
    );

// passport provides an authenticate() function, which is used as route middleware to authenticate requests
// When the authentication fails failureFlash flashes a message Like: username or password is incorrect

router.get("/logout", userController.logout);
module.exports = router;