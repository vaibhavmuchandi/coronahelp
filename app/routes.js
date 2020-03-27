module.exports = (app, passport) => {
  let request = require('request');
  let Store = require('../app/models/stores');
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
    res.render('add-store', {
      valid: false,
      details: {},
      alert: 1
    })
  })

  app.post('/add-store', (req, res) => {
    storeName = req.body.storeName;
    storeArea = req.body.autocomplete;
    storeLocality = req.body.resultid;
    storeContact = req.body.storeContact;
    storeAddress = req.body.storeAddress;
    storeLandmark = req.body.storeLandmark;
    itemsAvailable = req.body.items;
    var newStore = {
      storeLocation: storeLocality,
      storeArea: storeArea,
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

  app.post('/send-otp', (req, res, next) => {
    let phoneNumber = req.body.phoneNumber;
    let details = JSON.parse(req.body.details);
    app.set('details', details);
    var options = {
      method: 'GET',
      url: 'http://2factor.in/API/V1/e84b3273-63bb-11ea-9fa5-0200cd936042/SMS/' + phoneNumber + '/AUTOGEN',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {}
    };

    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      let det = JSON.parse(body)
      app.set('sessionNum', det.Details);
      console.log(det.Details);
    });
  })

  app.post('/verify-otp', (req, res) => {
    let sessNum = app.get('sessionNum');
    let details = app.get('details');
    var verificationCode = req.body.otp;
    var options = {
      method: 'GET',
      url: 'http://2factor.in/API/V1/e84b3273-63bb-11ea-9fa5-0200cd936042/SMS/VERIFY/' + sessNum + '/' + verificationCode,
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
          alert: 'Invalid OTP'
        });
      }
    });
  })
}