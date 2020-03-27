var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({
  storeLocation: String,
  storeArea: String,
  storeName: String,
  storeContact: Number,
  storeFullAddress: String,
  storeLandmark: String,
  storeItems: String,
  storeDelivery: String
});

module.exports = mongoose.model('Store', storeSchema);