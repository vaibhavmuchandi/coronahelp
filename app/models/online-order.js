var mongoose = require('mongoose');


var orderSchema = mongoose.Schema({
  orderNumber: String,
  customerName: String,
  customerContact: Number,
  customerAddress: String,
  finalItems: [{
    item: String,
    qty: String
  }]
})

module.exports = mongoose.model('Order', orderSchema);