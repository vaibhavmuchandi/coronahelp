var express     = require('express');
var port        = process.env.PORT || 3000;
var mongoose    = require('mongoose');
var passport    = require('passport');
var flash       = require('connect-flash');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var methodOverride = require('method-override');
var AddressAutocomplete = require('google-address-autocomplete');

//const uri = "mongodb+srv://vaibhav:vaibhav@123@cluster0-xuirx.mongodb.net/test?retryWrites=true&w=majority";
//mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});

var app         = express();
require('./config/passport')(passport);


app.use(require("express-session")({
    secret: "India is my country I love my country",
    resave: false,
    saveUninitialized: false
  }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

require('./app/routes')(app, passport);

app.listen(3000, ()=> console.log(`Server started at ${port}`));