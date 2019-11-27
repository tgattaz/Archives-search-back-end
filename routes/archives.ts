"use strict"

const axios = require('axios');
const router = require('express').Router();
const parser = require('xml2js');
const Token = require("../token");

let t = new Token();

function SendResult(req, response) {

  
  axios.all([
    axios.get('http://export.arxiv.org/api/query?search_query='+req.params.filter),
    axios.get('http://api.archives-ouvertes.fr/search/?q='+req.params.filter+'&wt=json&fl=*')
  ]).then(axios.spread((response1, response2) => {
    const result = {}; 

    var result1;
    parser.Parser().parseString(response1.data, (e, r) => {result1 = r});
    
    var result2 = response2.data;

    if(result1.feed.hasOwnProperty('entry') && result2.response.hasOwnProperty('docs')){

      result["doc"] = new Array(result1.feed["entry"].length+result2.response["docs"].length);

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
            result["doc"][result1.feed["entry"].length+i] = new Object();
            result["doc"][result1.feed["entry"].length+i].titre = result2.response[element][i].title_s[0];
            result["doc"][result1.feed["entry"].length+i].date = result2.response[element][i].submittedDate_tdate;
            result["doc"][result1.feed["entry"].length+i].auteur = result2.response[element][i].authFullName_s[0];
            if((result2.response[element][i].authFullName_s.length)>1){
              result["doc"][result1.feed["entry"].length+i].co_auteurs = "";
              delete result2.response[element][i].authFullName_s[0];
              result2.response[element][i].authFullName_s.forEach(function(element) {
                result["doc"][result1.feed["entry"].length+i].co_auteurs = result["doc"][result1.feed["entry"].length+i].co_auteurs + element + "; ";
              });

            };
            result["doc"][result1.feed["entry"].length+i].url = result2.response[element][i].uri_s;
            result["doc"][result1.feed["entry"].length+i].summary = result2.response[element][i].label_s;
            result["doc"][result1.feed["entry"].length+i].source = "HAL";
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

/* Route pour récupérer la todolist en JSON */
router.get('/json/:filter', t.tokenRequired, SendResult);

/* Route pour récupérer la todolist en XML */
router.get('/xml/:filter', t.tokenRequired, SendResult);

module.exports = router;