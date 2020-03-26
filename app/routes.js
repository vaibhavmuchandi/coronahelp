module.exports = (app, passport) => {
  var AddressAutocomplete = require('google-address-autocomplete');
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

  app.get('/list-stores', (req, res) => {
    res.render('list')
  })

  app.get('/test', (req, res) => {
    res.render('test')
  })

}