var request = require('request');
var router = require('express').Router();

/* Route pour récupérer la todolist  */
router.get('/', function(req, res1) {
    
    request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
        if (err) { return console.log(err); }
        console.log(body.url);
        console.log(body.explanation);
    });

    res1.send(res1);
});


module.exports = router;
