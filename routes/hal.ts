var request = require('request');
var router = require('express').Router();

router.get('/:filter', function(req, response) {
    let query = req.params.filter;

    let url = 'http://api.archives-ouvertes.fr/search/?q='+query+'&wt=json&fl=*';

    request(url, { json : true }, (err, res, body) => {
            if (err) { return console.log(err); }
            response.send(body);
        });
});

module.exports = router;