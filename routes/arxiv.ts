var request = require('request');
var router = require('express').Router();
var parser = require('xml2js');

/* Route pour récupérer la todolist  */
router.get('/', function(req, response) {
    
    var result;
    
    request('http://export.arxiv.org/api/query?search_query=test', { xml: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        parser.Parser().parseString(body, (e, r) => {result = r});
        response.send(result);

    });

});


module.exports = router;
