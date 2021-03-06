import express = require('express');
import bodyParser = require('body-parser');
import morgan = require('morgan');
let dataLayer = require('./dataLayer');

let app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", '*'); // update to match the domain you will make the request from
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, accept, Token, token");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE, PATCH");
  next();
});

app.use('/archives', require('./routes/archives'));
app.use('/token', require('./routes/auth'));
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

dataLayer.init(function(){
  console.log('Initialisation du dataLayer');
  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
});