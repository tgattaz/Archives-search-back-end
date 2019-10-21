import client = require('mongoose');
const VARIABLES = require('./variables');

let dataLayer = {

    init : function(cb){

      client.connect(VARIABLES.MONGO_URL, { useNewUrlParser: true});
  
      let db = client.connection; 
      db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
      db.once('open', function (){
        console.log("Connexion à la base OK");
      });
      cb();
    }
};

module.exports = dataLayer;