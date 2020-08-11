require('dotenv').config()
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const user = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const dbName = process.env.MONGODB_DBNAME;
 
let credentials = '';
 
if (typeof user !== 'undefined' && user !== '') {
   credentials = user + ':' + password + '@';
}
//const url = 'mongodb://' + credentials + host + ':' + port + '/' + dbName ;
const url = 'mongodb://genUsr:3BPDNS2S3TXM@35.226.19.219:27017/S2';
console.log('db_Conf URL ', url);
//const url = 'mongodb://' + host + ':' + port + '/' + dbName;
const client_options = {
    useUnifiedTopology: true,
    useNewUrlParser: true
    };
 
module.exports = {
   url,
   client_options
};
