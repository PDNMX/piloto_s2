'use strict';

var utils = require('../utils/writer.js');
var Spic = require('../service/SpicService');

module.exports.get_dependencias = function get_dependencias (req, res, next) {
  Spic.get_dependencias()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
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
