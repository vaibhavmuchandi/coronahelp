module.exports = (app, passport) => {
  let request = require('request');
  let Store = require('../app/models/stores');
  app.get('/', (req, res) => {
    let cities = new Set();
    Store.distinct('storeArea', (err, areas) => {
      app.set('areas', areas);
      areas.forEach((areas) => {
        let parts = areas.split(',');
        let length = parts.length;
        if (length >= 3)
          cities.add(parts[length - 3].trim() + ',' + parts[length - 2]);
      })
      res.render('index', {
        cities: [...cities].sort(),
        areas: areas
      })
    })
  })

  app.get('/list-stores', (req, res) => {
    res.locals.areas = app.get('areas') || [];
    res.render('list', {
      stores: [],
      message: 'Enter a location to search for stores'
    })
  })


  app.post('/list-stores', (req, res) => {
    let placeid = req.body.resultid;
    res.locals.areas = app.get('areas') || [];
    let area = req.body.autocomplete;
    area = area.replace(/belagavi/ig, 'Belgaum');
    area = area.replace(/bangalore/ig, 'Bengaluru');
    area = area.replace(/belgaum district/ig, 'Belgaum');
    res.locals.filters = null;
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

  app.get('/apply-filters', (req, res) => {
    let stores = app.get('stores');
    res.locals.filters = null;
    res.locals.areas = app.get('areas') || [];
    if (!stores) {
      res.render('list', {
        stores: [],
        message: 'Enter a location to search for stores'
      })
    } else {
      res.render('list', {
        stores: stores,
        message: null,
      })
    }
  })

  app.post('/apply-filters', (req, res) => {
    let filters = req.body.filters.split(',');
    res.locals.filters = filters.join(', ');
    res.locals.areas = app.get('areas') || [];
    let stores = app.get('stores');
    let message = null;
    let results = [];
    let items = null;
    if (stores) {
      if (filters.length == 1 && filters[0] == 'Delivery') {
        results = stores.filter((store, i, arr) => {
          return store.storeDelivery == 'Yes'
        })
      } else {
        stores.forEach((store, i, arr) => {
          items = store.storeItems.split(',');
          if (items.some((item, i, arr) => {
              return filters.indexOf(item) != -1
            })) {
            results.push(store);
          }
        })

        if (filters.indexOf('Delivery') != -1)
          results = results.filter((store, i, arr) => {
            return store.storeDelivery == 'Yes'
          })
      }

      if (results.length == 0)
        message = 'Sorry! No stores match your filters'
    }

    res.render('list', {
      stores: results,
      message: message
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
    storeArea = storeArea.replace(/belgaum district/ig, 'Belgaum');
    storeLocality = "abcd",
      storeContact = req.body.storeContact;
    storeAddress = req.body.storeAddress;
    storeOpenTime = req.body.storeOpenTime;
    storeCloseTime = req.body.storeCloseTime;
    storeLandmark = req.body.storeLandmark;
    itemsAvailable = req.body.items;
    storeDelivery = req.body.radio;
    storeAdditional = req.body.storeAdditional;
    var newStore = {
      storeLocation: storeLocality,
      storeArea: storeArea,
      storeName: storeName,
      storeContact: storeContact,
      storeFullAddress: storeAddress,
      storeOpenTime: storeOpenTime,
      storeCloseTime: storeCloseTime,
      storeLandmark: storeLandmark,
      storeItems: itemsAvailable,
      storeDelivery: storeDelivery,
      storeAdditional: storeAdditional
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
  });

  app.get('/vegetable-vans-belgaum', (req, res) => {
    res.render('vegetable-vans');
  })

  app.use((req, res, next) => {
    res.status(502);
    let areas = app.get('areas') || [];
    res.render('index', {
      cities: [],
      areas: areas
    })
  })

  app.use((req, res, next) => {
    res.status(404);
    let areas = app.get('areas') || [];
    res.render('index', {
      cities: [],
      areas: areas
    })
  })
}