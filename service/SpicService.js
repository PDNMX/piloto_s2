'use strict';
// MongoDB
var dbConf = require('../utils/db_conf');
const { url, client_options } = require('../utils/db_conf');
var { Spic } = require('../utils/models');
const { MongoClient, ObjectID } = require('mongodb');


function diacriticSensitiveRegex(string = '') {
    return string.replace(/a/g, '[a,á,à,ä]')
        .replace(/e/g, '[e,é,ë]')
        .replace(/i/g, '[i,í,ï]')
        .replace(/o/g, '[o,ó,ö,ò]')
        .replace(/u/g, '[u,ü,ú,ù]')
        .replace(/A/g, '[a,á,à,ä]')
        .replace(/E/g, '[e,é,ë]')
        .replace(/I/g, '[i,í,ï]')
        .replace(/O/g, '[o,ó,ö,ò]')
        .replace(/U/g, '[u,ü,ú,ù]')
}

async function getDependencias (){
  let dependencias = await Spic.find({institucionDependencia : {$exists: true }}).distinct('institucionDependencia').exec();
  return dependencias;
}

async function post_spic (body) {
    let sortObj = body.sort;
    let page = body.page;  //numero de papostgina a mostrar
    let pageSize = body.pageSize;
    let query = body.query;

    let newQuery= {};
    let newSort={};

    for (let [key, value] of Object.entries(sortObj)) {
        if(key === "institucionDependencia"){
            newSort[key+".nombre"]= value
        }if(key === "puesto"){
            newSort[key+".nombre"]= value
        }else{
            newSort[key]= value;
        }
    }

    for (let [key, value] of Object.entries(query)) {
        if( key === "curp" || key === "rfc"){
            newQuery[key] = { $regex : value,  $options : 'i'}
        }
        else if(key === "segundoApellido" ){
            newQuery[key] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'}
        }else if(key === "primerApellido"){
            newQuery[key] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'}
        }
        else if(key === "nombres"){
            newQuery[key] = { $regex : diacriticSensitiveRegex(value),  $options : 'i'}
        }else if(key === "institucionDependencia"){
            newQuery[key+".nombre"]={ $regex : diacriticSensitiveRegex(value),  $options : 'i'}
        }else if( key === "tipoProcedimiento"){
            newQuery[key+".clave"]= { $in : value};
        }else{
            newQuery[key]= value;
        }
    }

    if(pageSize <= 200 && pageSize >= 1){
        let dependencias  = await Spic.paginate(newQuery,{page :page , limit: pageSize, sort: newSort}).then();
        let objpagination ={hasNextPage : dependencias.hasNextPage, page:dependencias.page, pageSize : dependencias.limit, totalRows: dependencias.totalDocs }
        let objresults = dependencias.docs;

        let dependenciasResolve= {};
        dependenciasResolve["results"]= objresults;
        dependenciasResolve["pagination"] = objpagination;

        return dependenciasResolve;

    }else{
        throw new RangeError("page size fuera del limite, verificar campo");
    }
}
module.exports.post_spic = post_spic;
module.exports.getDependencias = getDependencias;

/**
 * Servidores públicos que intervienen en contrataciones.
 *
 * body ReqSpic JSON para peticiones de busqueda avanzada
 * returns resSpic
 **/

exports.post_spicP = function(body) {
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

