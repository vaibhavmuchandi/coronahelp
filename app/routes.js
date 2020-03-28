module.exports = (app, passport) => {
  let request = require('request');
  let Store = require('../app/models/stores');
  app.get('/', (req, res) => {
    let cities = new Set();
    Store.distinct('storeArea', (err, areas) => {
      console.log(areas);
      areas.forEach((area) => {
        let parts = area.split(',')
        let length = parts.length;
        if (length >= 3)
          cities.add(parts[length - 3].trim() + ',' + parts[length - 2]);
      })
      res.render('index', {
        cities: [...cities].sort()
      })
    })
  })

  app.get('/list-stores', (req, res) => {
    res.render('list', {
      stores: [],
      message: 'Enter a location to search for stores'
    })
  })


  app.post('/list-stores', (req, res) => {
    let placeid = req.body.resultid;
    let area = req.body.autocomplete;
    area = area.replace(/belagavi/ig, 'Belgaum');
    Store.find({
        $or: [{
          storeLocation: placeid
        }, {
          storeArea: {
            $regex: area,
            $options: 'i'
          }
        }]
      })
      .sort({
        storeName: 1
      })
      .exec((err, stores) => {
        if (stores.length != 0) {
          app.set('stores', stores);
          res.render('list', {
            stores: stores,
            message: null,
            delivery: false
          })
        } else {
          res.render('list', {
            stores: [],
            message: 'Sorry! There seem to be no stores from this area on our site.',
            delivery: false
          })
        }

      })
  })

  app.get('/home-delivery', (req, res) => {
    let stores = app.get('stores');
    if (!stores) {
      res.render('list', {
        stores: [],
        message: 'Enter a location to search for stores'
      })
    } else {
      res.render('list', {
        stores: stores,
        message: null,
        delivery: false
      })
    }
  })

  app.post('/home-delivery', (req, res) => {
    let value = req.body.delivery;
    let stores = app.get('stores');
    let message = null;
    if (value) {
      stores = stores.filter((store, i, arr) => {
        return store.storeDelivery == 'Yes'
      })
      res.locals.delivery = true
    } else {
      res.locals.delivery = false
    }

    if (stores.length == 0)
      message = 'Sorry! No search results match your filter.';

    res.render('list', {
      stores: stores,
      message: message,
    })
  })

  app.get('/add-store', (req, res) => {
    res.render('add-store', {
      valid: null,
      details: {},
      alert: 1
    })
  })

  app.post('/add-store', (req, res) => {
    storeName = req.body.storeName;
    storeArea = req.body.autocomplete;
    storeArea = storeArea.replace(/belagavi/ig, 'Belgaum');
    storeLocality = req.body.resultid;
    storeContact = req.body.storeContact;
    storeAddress = req.body.storeAddress;
    storeLandmark = req.body.storeLandmark;
    itemsAvailable = req.body.items;
    storeDelivery = req.body.radio
    var newStore = {
      storeLocation: storeLocality,
      storeArea: storeArea,
      storeName: storeName,
      storeContact: storeContact,
      storeFullAddress: storeAddress,
      storeLandmark: storeLandmark,
      storeItems: itemsAvailable,
      storeDelivery: storeDelivery
    }
    Store.create(newStore, function(err, createdStore) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.render('thank-you')
      }
    })
  })

  app.post('/send-otp', (req, res, next) => {
    let phoneNumber = req.body.phoneNumber;
    let details = JSON.parse(req.body.details);
    app.set('details', details);
    var options = {
      method: 'GET',
      url: 'http://2factor.in/API/V1/2ab4e5d4-685c-11ea-9fa5-0200cd936042/SMS/' + phoneNumber + '/AUTOGEN',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {}
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      let det = JSON.parse(body)
      app.set('sessionNum', det.Details);
    });

    res.render('add-store', {
      valid: false,
      details: details,
      alert: null
    });
  })

  app.post('/verify-otp', (req, res) => {
    let sessNum = app.get('sessionNum');
    let details = app.get('details');
    var verificationCode = req.body.otp;
    var options = {
      method: 'GET',
      url: 'http://2factor.in/API/V1/2ab4e5d4-685c-11ea-9fa5-0200cd936042/SMS/VERIFY/' + sessNum + '/' + verificationCode,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {}
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      if (response.statusCode == 200) {
        res.render('add-store', {
          valid: true,
          details: details,
          alert: null
        });
      } else {
        res.render('add-store', {
          valid: false,
          details: {},
          alert: 'Incorrect OTP'
        });
      }
    });
  })
}