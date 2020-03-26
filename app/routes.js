module.exports = (app, passport) => {

  var Store = require('../app/models/stores');
  app.get('/', (req, res) => {
    res.render('index')
  })
  app.post('/', (req, res) => {
    placeid = req.body.resultid
    res.send(placeid)
  })

  app.get('/add-store', (req, res) => {
    res.render('add-store')
  })
  app.post('/add-store', (req, res) => {
    storeName = req.body.storeName;
    storeLocality = req.body.resultid;
    storeContact = req.body.storeContact;
    storeAddress = req.body.storeAddress;
    storeLandmark = req.body.storeLandmark;
    itemsAvailable = req.body.items;
    var newStore = {
      storeLocation: storeLocality,
      storeName: storeName,
      storeContact: storeContact,
      storeFullAddress: storeAddress,
      storeLandmark: storeLandmark,
      storeItems: itemsAvailable
    }
    Store.create(newStore, function(err, createdStore) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Thank you")
        console.log(createdStore)
      }
    })
  })
}