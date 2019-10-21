import express = require('express');
import bodyParser = require('body-parser');
import mongoose = require('mongoose');
import morgan = require('morgan');
let dataLayer = require('./dataLayer');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use('/arxiv', require('./routes/arxiv'));
app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Endpoints
app.get("/", function(req, res) {
  let msg = {"key":"j'adore les cours de quafafou"};
  res.send(msg);
});

dataLayer.init(function(){
  console.log('Initialisation du dataLayer');
  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
});