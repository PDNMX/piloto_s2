'use strict';
// MongoDB
var _ = require('underscore');
var { Spic } = require('../utils/models');
var ObjectId = require('mongoose').Types.ObjectId;

function diacriticSensitiveRegex(string = '') {
    string = string.toLowerCase().replace("ñ","#");
    string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return string.replace(/a/g, '[a,á,à,ä]')
        .replace(/e/g, '[e,é,ë]')
        .replace(/i/g, '[i,í,ï]')
        .replace(/o/g, '[o,ó,ö,ò]')
        .replace(/u/g, '[u,ü,ú,ù]')
        .replace(/#/g,"ñ");
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
    let select = {
        'rfc':0,
        'curp':0,
        'genero':0,
        'superiorInmediato.curp':0,
        'superiorInmediato.rfc':0,
    }

    if(page <= 0 ){
        throw new RangeError("Error campo page fuera de rango");
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
                if((value.trim().length || 0) > 0){
                    if(ObjectId.isValid(value)){
                        newQuery["_id"] = value;
                    }else{
                        newQuery["_id"] = null;
                    }
                }
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
                if(value.length > 0){
                    newQuery[key+".clave"]= { $in : value};
                }
            }else{
                newQuery[key]= value;
            }
        }
            console.log(newQuery);
        if(pageSize <= 200 && pageSize >= 1){
            let paginationResult  = await Spic.paginate(newQuery,{page :page , limit: pageSize, sort: newSort,select:select, collation:{locale:'es'}}).then();
            let objpagination ={hasNextPage : paginationResult.hasNextPage, page:paginationResult.page, pageSize : paginationResult.limit, totalRows: paginationResult.totalDocs }
            let objresults = paginationResult.docs;

            try {
                var strippedRows = _.map(objresults, function (row) {
                    let rowExtend=  _.extend({id: row._id} , row.toObject());
                    return _.omit(rowExtend, '_id');
                });
            }catch (e) {
                console.log(e);
            }

            let objResponse= {};
            objResponse["pagination"] = objpagination;
            objResponse["results"]= strippedRows;
            return objResponse;

        }else{
            throw new RangeError("Error campo pageSize fuera de rango, el rango del campo es 1..200 ");
        }
    }
}
module.exports.post_spic = post_spic;
module.exports.getDependencias = getDependencias;
