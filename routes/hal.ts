var request = require('request');
var router = require('express').Router();
var parser = require('xml2js');

router.get('/', function(req, response) {
    let result;

    request('http://api.archives-ouvertes.fr/search/?q=lymphocyte&wt=json&fl=*', { json : true},
        (err, res, body) => {
            if (err) { return console.log(err); }

            parser.Parser().parseString(body, (e, r) => {result = r});
            response.send(result);
        });
});

module.exports = router;