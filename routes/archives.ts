const axios = require('axios');
var router = require('express').Router();
var parser = require('xml2js');

function ChooseRequestHAL(filter, route) {
  if(route.includes("titre")){
    return axios.get('http://api.archives-ouvertes.fr/search/?q=title_t:'+filter+'&wt=json&fl=*');
  }else if(route.includes("auteur")){
    return axios.get('http://api.archives-ouvertes.fr/search/?q=authFullName_t:'+filter+'&wt=json&fl=*');
  }else {
    return axios.get('http://api.archives-ouvertes.fr/search/?q='+filter+'&wt=json&fl=*');
  };
}

function ChooseRequestARXIV(filter, route) {
  if(route.includes("titre")){
    return axios.get('http://export.arxiv.org/api/query?search_query=ti:'+filter);
  }else if(route.includes("auteur")){
    return axios.get('http://export.arxiv.org/api/query?search_query=au:'+filter);
  }else {
    return axios.get('http://export.arxiv.org/api/query?search_query='+filter);
  }; 
}

function SendResult(req, response) {
  
  axios.all([ChooseRequestARXIV(req.params.filter,req.route.path),ChooseRequestHAL(req.params.filter,req.route.path)]).then(axios.spread((response1, response2) => {
    const result = {}; 

    var ARXIVlength = 0;

    var result1;
    parser.Parser().parseString(response1.data, (e, r) => {result1 = r});
    
    var result2 = response2.data;

    if(result1.feed.hasOwnProperty('entry') || result2.response.hasOwnProperty('docs')){

      if(result1.feed.hasOwnProperty('entry') && result2.response.hasOwnProperty('docs')){
        result["doc"] = new Array(result1.feed["entry"].length+result2.response["docs"].length);
        ARXIVlength=result1.feed["entry"].length;
      }else if(!result1.feed.hasOwnProperty('entry') && result2.response.hasOwnProperty('docs')){
        result["doc"] = new Array(result2.response["docs"].length);
      }else if(result1.feed.hasOwnProperty('entry') && !result2.response.hasOwnProperty('docs')){
        result["doc"] = new Array(result1.feed["entry"].length);
      };

      Object.keys(result1.feed)
      .forEach(function(element) {
        if(element=="entry"){       
          for (var i = 0; i < result1.feed[element].length; i++) {
            result["doc"][i] = new Object();
            result["doc"][i].titre = result1.feed[element][i].title[0];
            result["doc"][i].date = result1.feed[element][i].published[0];
            result["doc"][i].auteur = result1.feed[element][i].author[0].name[0];
            if((result1.feed[element][i].author.length)>1){
              result["doc"][i].co_auteurs = "";
              delete result1.feed[element][i].author[0];
              result1.feed[element][i].author.forEach(function(element) {
                result["doc"][i].co_auteurs = result["doc"][i].co_auteurs + element.name[0] + "; ";
              });

              };
              result["doc"][i].url = result1.feed[element][i].link[0].$.href;
              result["doc"][i].summary = result1.feed[element][i].summary[0];
              result["doc"][i].source = "ARXIV";
            };
          };
        });

      Object.keys(result2.response)
      .forEach(function(element) {
        if(element=="docs"){   
          for (var i = 0; i < (result2.response[element].length); i++) {
            result["doc"][ARXIVlength+i] = new Object();
            result["doc"][ARXIVlength+i].titre = result2.response[element][i].title_s[0];
            result["doc"][ARXIVlength+i].date = result2.response[element][i].submittedDate_tdate;
            result["doc"][ARXIVlength+i].auteur = result2.response[element][i].authFullName_s[0];
            if((result2.response[element][i].authFullName_s.length)>1){
              result["doc"][ARXIVlength+i].co_auteurs = "";
              delete result2.response[element][i].authFullName_s[0];
              result2.response[element][i].authFullName_s.forEach(function(element) {
                result["doc"][ARXIVlength+i].co_auteurs = result["doc"][ARXIVlength+i].co_auteurs + element + "; ";
              });

            };
            result["doc"][ARXIVlength+i].url = result2.response[element][i].uri_s;
            result["doc"][ARXIVlength+i].summary = result2.response[element][i].label_s;
            result["doc"][ARXIVlength+i].source = "HAL";
            };

          };
          
        });
    }

    if(req.route.path.includes("json")){
      response.send(result);
    }else if(req.route.path.includes("xml")){
      var builder = new parser.Builder();
      var xml = builder.buildObject(result);
      response.send(xml);
    };

  })).catch(error => {
    console.log(error);
  });    


};

function XMLresult(req, response) {
  var builder = new parser.Builder();
  var json = SendResult(req, response);
  var xml = builder.buildObject(json);
  response.send(xml);
};

/* API */

/* Route pour faire une recherche basique avec retour en JSON */
router.get('/json/:filter', SendResult);

/* Route pour faire une recherche basique avec retour en XML */
router.get('/xml/:filter', SendResult);

/* Route pour faire une recherche dans le champ titre en particulier avec retour en JSON */
router.get('/json/titre/:filter', SendResult);

/* Route pour faire une recherche dans le champ titre en particulier avec retour en XML */
router.get('/xml/titre/:filter', SendResult);

/* Route pour faire une recherche dans le champ auteur en particulier avec retour en JSON */
router.get('/json/auteur/:filter', SendResult);

/* Route pour faire une recherche dans le champ auteur en particulier avec retour en XML */
router.get('/xml/auteur/:filter', SendResult);


module.exports = router;
