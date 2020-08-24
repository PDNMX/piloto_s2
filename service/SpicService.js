'use strict';
// MongoDB
var _ = require('underscore');
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


/**
 * Servidores públicos que intervienen en contrataciones.
 *
 * body ReqSpic JSON para peticiones de busqueda avanzada
 * returns resSpic
 **/


async function post_spic (body) {
    let sortObj = body.sort  === undefined ? {} : body.sort;
    let page = body.page;  //numero de papostgina a mostrar
    let pageSize = body.pageSize;
    let query = body.query === undefined ? {} : body.query;

    if(page <= 0 ){
        throw new RangeError("page out of range");
    }else{
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
            if(key === "id"){
                newQuery["_id"] = value;
            }else if( key === "curp" || key === "rfc"){
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

            try {
                var strippedRows = _.map(objresults, function (row) {
                    let rowExtend=  _.extend({id: row._id} , row.toObject());
                    return _.omit(rowExtend, '_id');
                });
            }catch (e) {
                console.log(e);
            }

            let dependenciasResolve= {};
            dependenciasResolve["results"]= strippedRows;
            dependenciasResolve["pagination"] = objpagination;

            return dependenciasResolve;

        }else{
            throw new RangeError("page size out of range");
        }
    }
}
module.exports.post_spic = post_spic;
module.exports.getDependencias = getDependencias;
