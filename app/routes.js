module.exports = (app, passport) => {
    var store = require('../app/models/stores')
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
        storeLocality = req.body.resultid;
        res.send(storeLocality)
    })

    app.get('/test', (req, res) => {
        res.render('test')
    })

}