var patientMod = require("../model/model").model;

exports.patientAdd = function (req, res) {
    var postData = "";
    var result = {};
    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function () {
        var obj = JSON.parse(postData);
        var PatientNo = 0;
        patientMod.count({}, "Patient", function (err, n) {
            if (err) {
                result = { "success": false, "data": n }
            } else {
                PatientNo = (n + 1).toString();
                obj["PatientNo"] = PatientNo;
                patientMod.insert(obj, "Patient", function (err, r) {
                    if (err) {
                        result = { "success": false, "data": r };
                    } else {
                        result = { "success": true, "data": r };
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(result));
                });
            }
        });
    });
};

exports.patientQuery = function (req, res) {
    var postData = "";
    var result = {};
    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function () {
        var obj = JSON.parse(postData);

        patientMod.find(obj, "Patient", function (err, docs) {
            if (err) {
                result = { "success": false, "data": docs };
            } else {
                result = { "success": true, "data": docs };
            }
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify(result));
        });
    });
};