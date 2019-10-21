var request = require('request');
var router = require('express').Router();
var parser = require('xml2js');

router.get('/:q', function(req, response) {
    let query = req.params.q;

    let url = 'http://api.archives-ouvertes.fr/search/?q='+query+'&wt=json&fl=*';

    request(url, { json : true },
        (err, res, body) => {
            if (err) { return console.log(err); }

            response.send(body.response.docs);
        });
});

module.exports = router;