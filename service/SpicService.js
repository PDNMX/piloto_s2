'use strict';

// MongoDB
var mongoose = require('mongoose');
var { Spic } = require('../utils/models');


async function getDependencias (){
  let dependencias = await Spic.find({institucionDependencia : {$exists: true }}).distinct('institucionDependencia').exec();
  return dependencias;
}

module.exports.getDependencias = getDependencias;

exports.get_dependencias = function() {
  return new Promise(function(resolve, reject) {

     MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
     const db = client.db();
     const spic = db.collection('spic');

     spic.createIndex({ 'posts.when': -1 })

     .then(() => spic.aggregate([
      { $group: { _id: { nombre: "$institucionDependencia.nombre", siglas: "$institucionDependencia.siglas", clave: "$institucionDependencia.clave" } } },
       ]).toArray())
           .then(results => {
            return resolve(results);
        });
     });


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
   let {
          page,
          pageSize,
          sort,
          nombre,
          clave,
          siglas
      } = body;


   console.log('Body...', body);


      const params = [
          "nombres", "primerApellido", "segundoApellido", "curp", "rfc"
      ];

      let query = {"institucionDependencia" : { "nombre" : nombre, "clave" : clave, "siglas" : siglas }};
      let _query= {"ejercicioFiscal" : "2016"};
      let _sort = {};
      var out = {};

      if (typeof sort !== 'undefined') {
          const sortFields = ["nombres", "primerApellido", "segundoApellido", "puesto", "institucionDependencia"];
     sortFields.forEach(p => {
              if (sort.hasOwnProperty(p) || typeof sort[p] === 'string') {
                  _sort[p] = sort[p] !== 'asc' ? -1 : 1;
              }
          });
      }

      if (typeof query !== 'undefined') {
          params.forEach(p => {
              if (query.hasOwnProperty(p) || typeof query[p] === "string") {
                  _query[p] = { $regex: query[p], $options: 'i' };
              }
          });

          if (query.hasOwnProperty('tipoProcedimiento') && Array.isArray(query.tipoProcedimiento) && query.tipoProcedimiento.length > 0) {
           console.log('TERCER IF ');
              let or = [];

              query.tipoProcedimiento.forEach(tp => {
                  or.push({ tipoProcedimiento: { $elemMatch: { clave: tp } } })
              });

              _query.$or = or
          }

          if (query.hasOwnProperty('id') && query['id'].length > 0) {
              _query['_id'] = (query['id'].length === 24) ? ObjectID(query['id']) : query['id'];
          }

        //  if (query.hasOwnProperty('institucionDependencia') && query['institucionDependencia'].length > 0) {
            //  _query['institucionDependencia.nombre'] = { $regex: query['institucionDependencia'], $options: 'i' };
          //}
      }

      console.log('---1',query);
      console.log('2----',_query);

       //Bloque de prueba:
       MongoClient.connect(dbConf.url, dbConf.client_options).then(client => {
            const db = client.db();
            const spic = db.collection('spic');
            const skip = page === 1 ? 0 : (page - 1) * pageSize;
           // console.log('page: ', page , '  pageSize',pageSize, 'query', query);
            let cursor = spic.find(query).skip(skip).limit(pageSize).collation({ locale: "en", strength: 1 });
           // console.log("Instruccion de busqueda", cursor);
            if (JSON.stringify(_sort) !== '{}') {
                cursor.sort(_sort);
                }
            cursor.count().then(totalRows => {
                  cursor.toArray()
                  .then(results => {
                  let hasNextPage = (page * pageSize) < totalRows;
                  out = {
                    "pagination" : {
                        "pageSize" : pageSize,
                        "page" : page,
                        "totalRows" : totalRows,
                        "hasNextPage" : hasNextPage
                    },
                    "results":results
                    }
                 // console.log('Salida----  ',out);
                  return resolve(out);

               });
             });
        });

  });
}
