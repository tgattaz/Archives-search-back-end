"use strict"

const Token = require("../token");
const router = require('express').Router();

let t = new Token();

function SendJWT(req, res) {
    res.send(t.create24hToken("identifiant de tes morts"));
}

/* Route pour récupérer un token */
router.get('/', SendJWT);

module.exports = router;

export {};