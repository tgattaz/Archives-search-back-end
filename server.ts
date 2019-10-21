/* Les imports */

//Express: infrastructure pour appli web
import express = require('express');

//BodyParser : Intergiciel pour les requêtes HTTP (req.body)
import bodyParser = require('body-parser');

//Mongoose : ODM pour MongoDB et Node.JS
let mongoose = require('mongoose');

//Morgan : Logger, crée les logs
var morgan = require('morgan');

/* Configuration */

//Modèles Mongoose pour insérer les données dans MongoDB en respectant la structure défini dans les schémas

//DataLayer : Couche de données, zone de transit vers le gestionnaire de données
var dataLayer = require('./dataLayer');


//Lancement de notre middleware, serveur Express
// Our Express APP config
const app = express();
//ajout du logger
app.use(morgan('dev'));
//Prends en charge le parsing des URL
app.use(bodyParser.urlencoded({'extended':'true'}));
//Prends en charge le parsing des Jsons
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

/* Les paths */

//Défini path relatif à partir d'un path absolu
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
// app.use('/images', express.static(__dirname + '/images'));
// app.use('/views', express.static(__dirname + '/views'));
//Défini path relatif à partir d'un autre path relatif
app.use('/arxiv', require('./routes/arxiv'));
//app.use('/', require('./routes/hal'));

/* Lancement */

app.set("port", process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Endpoints
app.get("/", function(req, res) {
  var msg = {"key":"j'adore les cours de quafafou"};
  res.send(msg);
});

// const Schema = mongoose.Schema;

// const User_schema = new Schema({
//   name: {
//     type: String
//   },
//   email: {
//       type: String
//   }
// },{
//     collection: 'users'
// });

// const User = mongoose.model('User', User_schema);

// const UserRouter = express.Router();

// UserRouter.route('/create').post(function (req, res) {
//   const user = new User(req.body);
//   console.log
//   user.save()
//     .then(user => {
//       res.json('User added successfully');
//     })
//     .catch(err => {
//       res.status(400).send("unable to save to database");
//     });
// });

// app.use('/user', UserRouter);

// const server = app.listen(app.get("port"), () => {
//   console.log("App is running on http://localhost:%d", app.get("port"));
// });

dataLayer.init(function(){
  console.log('Initialisation du dataLayer');
  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
});