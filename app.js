
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    conf = require('./conf');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3333);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/charge', function(req, res) {

var stripe = require("stripe")(conf.liveKey);

var stripeToken = req.body.token,
  email = req.body.email,
  amount = req.body.amount;

// console.log(req.body);

var charge = stripe.charges.create({
  amount: amount, // amount in cents, again
  currency: "usd",
  source: stripeToken,
  receipt_email: email,
  description: email,
}, function(err, charge) {
console.log(charge, err);
  if (err) {
    res.json({error: 'Card Declined'});
  } else {
    res.json({error: null});
  }
});

});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
