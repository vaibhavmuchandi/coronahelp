var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({
    storeName: String,
    storeLocation: String,
    storeItems: String,
    storeOwner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
});

module.exports = mongoose.model('Store', storeSchema);
