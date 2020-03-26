var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local: {
        username : String,
        password : String,
    },
    contact : String
});

passengerSchema.plugin(passportLocalMongoose)


module.exports = mongoose.model('User', userSchema);