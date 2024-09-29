// can only be acessed in developement phase and not in production phase
if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); // This should be at the very top
}

console.log(process.env.SECRET);

const express= require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session"); //required sessions
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;


main()
    .then(()=>{
        console.log("connected to DB");
    }).catch((err) => {
        console.log(err);
    });

async function main()
{
    await mongoose.connect(dbUrl); //now connecting to the atlas
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store =   MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});

//sessions
const sessionOptions = {
    store, //session info will stored in mongo now
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized : true,
    cookie : {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true   //done for security purposes (done to prevent from cross scripting attacks)
    }
};

// app.get("/",(req,res) =>{
//     res.send("Hi, I am root");
// });


app.use(session(sessionOptions));
app.use(flash());     //flash = //flash to be used before routes, as we will be implementing flash using routes only
app.use(passport.initialize());
app.use(passport.session()); // a web application needs the ability to identify users as they browse from page to page the series of request and responses. Each associated with the same user is known as a session.(har ek request ko pata ho ki woh kis session ka part hai)
passport.use(new LocalStrategy(User.authenticate())) //jitni bhi strategies aye woh localstrategy ke through authenticate hone chahiye and un users ko authenticate karine kehliye .authenticate() will be used

passport.serializeUser(User.serializeUser()); //store user related infos
passport.deserializeUser(User.deserializeUser()); //unstore user related infos

//passport uses session as it need to remember the user even if he visits different tabs


// middlware to define locals
app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();  //orelse we will get stuck in this middleware only
})

//pbkdf2 HASHING ALGO IS being used

//parent routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.all("*",(req,res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) =>{
    let{statusCode=500, message = "Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () =>{
    console.log("server is listening to port 8080");
});

