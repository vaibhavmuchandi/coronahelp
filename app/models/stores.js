var mongoose = require('mongoose');

var storeSchema = mongoose.Schema({
  storeLocation: String,
  storeArea: String,
  storeName: String,
  storeContact: Number,
  storeOpenTime: String,
  storeCloseTime: String,
  storeFullAddress: String,
  storeLandmark: String,
  storeItems: String,
  storeDelivery: String,
  storeAdditional: String
});

module.exports = mongoose.model('Store', storeSchema);