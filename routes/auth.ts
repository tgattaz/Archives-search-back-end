"use strict"

const Token = require("../token");
const router = require('express').Router();

let t = new Token();
let tokenJSON;

function SendJWT(req, res) {
    tokenJSON = new Object()
    tokenJSON.token = t.create24hToken("identifiant de connexion");
    res.send(tokenJSON);
}

/* Route pour récupérer un token */
router.get('/', SendJWT);

module.exports = router;

export {};