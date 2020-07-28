'use strict';


/**
 * Servidores públicos que intervienen en contrataciones
 *
 * returns dependencias
 **/
exports.get_dependencias = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "clave" : "XYZ987",
  "siglas" : "SHCP",
  "nombre" : "Secretaría baaaaaaammmmmmmmm"
}, {
  "clave" : "XYZ987",
  "siglas" : "SHCP",
  "nombre" : "Secretaría de Hacienda y Crédito Público"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Servidores públicos que intervienen en contrataciones.
 *
 * body ReqSpic JSON para peticiones de busqueda avanzada
 * returns resSpic
 **/
exports.post_spic = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "pagination" : {
    "hasNextPage" : true,
    "pageSize" : 100,
    "page" : 20,
    "totalRows" : 30
  },
  "results" : [ {
    "institucionDependencia" : {
      "clave" : "XYZ987",
      "siglas" : "SHCP",
      "nombre" : "Secretaría de Hacienda y Crédito Público"
    },
    "ramo" : {
      "clave" : 23,
      "valor" : "Provisiones salariales y económicas"
    },
    "primerApellido" : "Pérez",
    "segundoApellido" : "Mendez",
    "superiorInmediato" : {
      "puesto" : {
        "nombre" : "Director de área",
        "nivel" : "1234567890"
      },
      "primerApellido" : "Lopez",
      "segundoApellido" : "Perez",
      "curp" : "BADD110313HCMLNS09",
      "rfc" : "CUPU800825569",
      "nombres" : "Juan"
    },
    "rfc" : "JPM851111C44",
    "tipoProcedimiento" : [ {
      "clave" : 1,
      "valor" : "CONTRATACIONES PÚBLICAS"
    }, {
      "clave" : 1,
      "valor" : "CONTRATACIONES PÚBLICAS"
    } ],
    "nombres" : "John Juan",
    "puesto" : {
      "nombre" : "Director de área",
      "nivel" : "1234567890"
    },
    "tipoArea" : [ {
      "clave" : "T",
      "valor" : "TÉCNICA"
    }, {
      "clave" : "RE",
      "valor" : "RESPONSABLE DE LA EJECUCIÓN"
    } ],
    "nivelResponsabilidad" : [ {
      "clave" : "A",
      "valor" : "ATENCIÓN"
    }, {
      "clave" : "A",
      "valor" : "ATENCIÓN"
    } ],
    "fechaCaptura" : "2019-01-21T17:32:28Z",
    "ejercicioFiscal" : "2018",
    "genero" : {
      "clave" : "M",
      "valor" : "MASCULINO"
    },
    "id" : "RFT129",
    "curp" : "BEML920313HMCLNS09"
  }, {
    "institucionDependencia" : {
      "clave" : "XYZ987",
      "siglas" : "SHCP",
      "nombre" : "Secretaría de Hacienda y Crédito Público"
    },
    "ramo" : {
      "clave" : 23,
      "valor" : "Provisiones salariales y económicas"
    },
    "primerApellido" : "Pérez",
    "segundoApellido" : "Mendez",
    "superiorInmediato" : {
      "puesto" : {
        "nombre" : "Director de área",
        "nivel" : "1234567890"
      },
      "primerApellido" : "Lopez",
      "segundoApellido" : "Perez",
      "curp" : "BADD110313HCMLNS09",
      "rfc" : "CUPU800825569",
      "nombres" : "Juan"
    },
    "rfc" : "JPM851111C44",
    "tipoProcedimiento" : [ {
      "clave" : 1,
      "valor" : "CONTRATACIONES PÚBLICAS"
    }, {
      "clave" : 1,
      "valor" : "CONTRATACIONES PÚBLICAS"
    } ],
    "nombres" : "John Juan",
    "puesto" : {
      "nombre" : "Director de área",
      "nivel" : "1234567890"
    },
    "tipoArea" : [ {
      "clave" : "T",
      "valor" : "TÉCNICA"
    }, {
      "clave" : "RE",
      "valor" : "RESPONSABLE DE LA EJECUCIÓN"
    } ],
    "nivelResponsabilidad" : [ {
      "clave" : "A",
      "valor" : "ATENCIÓN"
    }, {
      "clave" : "A",
      "valor" : "ATENCIÓN"
    } ],
    "fechaCaptura" : "2019-01-21T17:32:28Z",
    "ejercicioFiscal" : "2018",
    "genero" : {
      "clave" : "M",
      "valor" : "MASCULINO"
    },
    "id" : "RFT129",
    "curp" : "BEML920313HMCLNS09"
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

