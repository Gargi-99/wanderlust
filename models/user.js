const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema= new Schema({
    email:{
        type: String,
        required: true
    }
});

//used as a plugin as it will automatically add username, hashed password and salting.
//It also has some methods that it will add = Vist API DOCUMENTATION
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);