/* Routes de arxiv  */


var router = require('express').Router();

/* Route pour récupérer la todolist  */
router.get('/', function(req, res) {

    res.send("romain est un bon chum qui rentre manger chez lui parce que le RU c'est dégueulasse ....");

});

module.exports = router;