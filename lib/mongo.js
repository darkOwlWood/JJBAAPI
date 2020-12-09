const { MongoClient } = require('mongodb');
const { config } = require('../config');

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const DB_HOST = config.dbHost;
const DB_NAME = config.dbName;
const PAGE_SIZE = parseInt(config.pageSize);

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

class MongoLib{

    constructor(){
        this.client = new MongoClient(MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true });
        this.dbName = DB_NAME;
        this.pageSize = PAGE_SIZE;
    }

    connect() {
        if(!MongoLib.connection){
            MongoLib.connection = new Promise((resolve,reject) => {
                this.client.connect( err => {
                    if(err){
                        reject(err);
                        return;
                    }

                    console.log('Connect succesfully to mongo');
                    resolve(this.client.db(this.dbName));
                });
            });
        }

        return MongoLib.connection;
    }

    getById(collection,idArray){
        return this.connect()
            .then( db => {
                return db 
                    .collection(collection)
                    .find({id: {'$in': idArray}})
                    .toArray();
        });
    }

    getAllMatchesInPage(collection,query,page){
        return this.connect()
            .then( db => {
                return db
                    .collection(collection)
                    .find(query)
                    .skip(this.pageSize*page)
                    .limit(this.pageSize)
                    .toArray();
            });
    }

    insert(collection,data){
        return this.connect()
            .then( db => {
                return db
                    .collection(collection)
                    .insertOne(data);
            })
            .then(result => result.insertedId);
    }

    update(collection,id,data){
        return this.connect()
            .then( db => {
                return db
                    .collection(collection)
                    .updateOne({id},{'$set': data}, {upsert: true});
            });
    }

    async delete(collection,id){
        return this.connect()
            .then( db => {
                return db
                    .collection(collection)
                    .deleteOne({id});
            });
    }

    getTotalDocuments(collection,query){
        return this.connect()
            .then( db => {
                return db
                .collection(collection)
                .find(query)
                .count();
        });
    }
}

module.exports = MongoLib;