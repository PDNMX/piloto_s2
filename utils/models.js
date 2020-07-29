const { Schema, model } = require('mongoose');

 
let spicSchema = new Schema({
   fechaCaptura: String,
   ejercicioFiscal: String,
   ramo: { clave: Number, valor: String },
   rfc: String,
   curp: String,
   nombres: String,
   primerApellido: String,
   segundoApellido: String,
   genero: {
       clave: String,
       valor: String
   },
   institucionDependencia: {
       nombre: String,
       clave: String,
       siglas: String
   },
   puesto: {
       nombre: String,
       nivel: String
   },
   tipoArea: { type: [], default: void 0 },
   tipoProcedimiento: { type: [], default: void 0 },
   nivelResponsabilidad: { type: [], default: void 0 },
   superiorInmediato: {
       nombres: String,
       primerApellido: String,
       segundoApellido: String,
       curp: String,
       rfc: String,
       puesto: {
           nombre: String,
           nivel: String
      }
   }
});
 
let Spic = model('Spic', spicSchema, 'spic');
 
module.exports = {
   spicSchema,
   Spic
};
