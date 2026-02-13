const mongo=require('mongodb');

const MongoClient=mongo.MongoClient;
const MONGO_URL='mongodb+srv://Gopesh:root@gopesh.07ba47h.mongodb.net/?appName=Gopesh';

let _db;

const mongoConnect=(callabck)=>{
    MongoClient.connect(MONGO_URL)
    .then(client=>{
        callabck();
        _db=client.db('airbnb');
    })
    .catch(err=>{
        console.log('Error while connecting to Mongo ',err);
    });
}
const getdb=()=>{
    if(!_db){
        throw new Error('No database found!');
    }
    return _db;
}


exports.mongoConnect=mongoConnect;
exports.getdb=getdb;
