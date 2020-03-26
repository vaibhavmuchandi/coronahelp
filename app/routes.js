module.exports = (app, passport) => {

  var Store = require('../app/models/stores');
  app.get('/', (req, res) => {
    res.render('index')
  })

  app.get('/list-stores', (req, res) => {
    res.render('list', {
      stores: [],
      message: 'Enter a location'
    })
  })
  app.post('/list-stores', (req, res) => {
    let placeid = req.body.resultid;
    Store.find({
        storeLocation: placeid
      })
      .exec((err, stores) => {
        if (stores.length != 0) {
          res.render('list', {
            stores: stores,
            message: null
          })
        } else {
          res.render('list', {
            stores: [],
            message: 'Sorry! There seem to be no stores from this area on our site.'
          })
        }

      })
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
        res.render('thank-you')
        console.log(createdStore)
      }
    })
  })

}

