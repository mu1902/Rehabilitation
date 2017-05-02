var MongoClient = require('mongodb');
var url = require('../config').config.DbUrl;

exports.model = {
    "insert": function (obj, coll, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                var collection = db.collection(coll);
                collection.insert(obj, function (err, result) {
                    callback(err, result);
                    db.close();
                })
            } else {
                //log("Connected mongo error");
            }
        })
    },

    "find": function (obj, coll, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                var collection = db.collection(coll);
                collection.find(obj).toArray(function (err, docs) {
                    callback(err, docs);
                    db.close();
                })
            } else {
                //console.log("Connected mongo error");
            }
        })
    },

    "count": function (obj, coll, callback) {
        MongoClient.connect(url, function (err, db) {
            if (err == null) {
                var collection = db.collection(coll);
                collection.count(obj, function (err, count) {
                    callback(err, count);
                    db.close();
                })
            } else {
                //console.log("Connected mongo error");
            }
        })
    }

}