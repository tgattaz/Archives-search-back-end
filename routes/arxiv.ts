var request = require('request');
var router = require('express').Router();
var parser = require('xml2js');

/* Route pour récupérer la todolist  */
router.get('/:filter', function(req, response) {
    let query = req.params.filter;

    let url = 'http://export.arxiv.org/api/query?search_query='+query;

    var result;
    
    request(url, { xml: true }, (err, res, body) => {
        if (err) { return console.log(err); }

        parser.Parser().parseString(body, (e, r) => {result = r});
        response.send(result);

    });

});


module.exports = router;
