/* Le Datalayer avec Mongoose  */

var client = require('mongoose');

var urlmongo = 'mongodb+srv://user:user@cluster0-zt25f.mongodb.net/hal-arxiv';

var db;

var dataLayer = {

    /* Initialisation du dataLayer  */
    init : function(cb){
  
      //Initialise la connexion entre l'API et notre BDD
  
      client.connect(urlmongo, { useNewUrlParser: true});
  
      db = client.connection;
  
      db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
  
      db.once('open', function (){
  
      console.log("Connexion à la base OK");
  
      });

      cb();

    }

};


module.exports = dataLayer;