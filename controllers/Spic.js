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
        let error="" ;
        if (err.message === "jwt must be provided"){
            error = "Error el token de autenticación (JWT) es requerido en el header, favor de verificar"
        }else if(err.message === "invalid signature" || err.message.includes("Unexpected token")){
            error = "Error token inválido, el token probablemente ha sido modificado favor de verificar"
        }else if (err.message ==="jwt expired"){
            error = "Error el token de autenticación (JWT) ha expirado, favor de enviar uno válido "
        }else {
            error = err.message;
        }

        let obj = {code: 401, message: error};
        return obj;
    }
}

async function get_dependencias (req, res, next) {
     var code = validateToken(req);
     if(code.code == 401){
         console.log(code);
         res.status(401).json({code: '401', message: code.message});
     }else if (code.code == 200 ){
         let dependencias = await Spic.getDependencias();
         utils.writeJson(res,dependencias);
     }
};

module.exports.post_spic = function post_spic (req, res, next, body) {
    var code = validateToken(req);
    if(code.code == 401){
        res.status(401).json({code: '401', message: code.message});
    }else if (code.code == 200 ){
        Spic.post_spic(body)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                if(response.message === "request.body.query.tipoProcedimiento should be array"){
                    res.status(422).json({code: '422', message:  "Error el campo tipoProcedimiento tiene que ser un arreglo"});
                }
                if(response.message === "request.body.query.tipoProcedimiento[0] should be <= 5"){
                    res.status(422).json({code: '422', message:  response.message});
                }
                if(response instanceof  RangeError){
                    res.status(422).json({code: '422', message:  response.message});
                }else if (response instanceof  SyntaxError){
                    res.status(422).json({code: '422', message:  response.message});
                }
            });
    }
};

module.exports.get_dependencias = get_dependencias;
