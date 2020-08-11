'use strict';

var utils = require('../utils/writer.js');
var Spic = require('../service/SpicService');
var jwt = require('jsonwebtoken');
require('dotenv').config({path: './utils/.env'});


var validateToken = function(req){
    var inToken = null;
    var auth = req.headers['authorization'];
    if (auth && auth.toLowerCase().indexOf('bearer') == 0) {
        inToken = auth.slice('bearer '.length);
    } else if (req.body && req.body.access_token) {
        inToken = req.body.access_token;
    } else if (req.query && req.query.access_token) {
        inToken = req.query.access_token;
    }
    // invalid token - synchronous
    try {
        var decoded =  jwt.verify(inToken, process.env.SEED );
        return {code: 200, message: decoded};
    } catch(err) {
        // err
        let obj = {code: 401, message: err};
        return obj;
    }
}

async function get_dependencias (req, res, next) {
     var code = validateToken(req);

     if(code.code == 401){
         res.status(401).json({code: '401', message: code.message});
     }else if (code.code == 200 ){
         let dependencias = await Spic.getDependencias();
         utils.writeJson(res,dependencias);
     }
};

module.exports.post_spic = function post_spic (req, res, next, body) {
  Spic.post_spic(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};


module.exports.get_dependencias = get_dependencias;
