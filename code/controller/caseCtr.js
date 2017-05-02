var caseMod = require("../model/model").model;

exports.caseAdd = function (req, res) {
    var postData = "";
    var result = {};
    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function () {
        var obj = JSON.parse(postData);
        var caseNo = 0;
        var patientObj = { "PatientNo": obj["PatientNo"], "Name": obj["Name"] };
        delete obj.PatientNo;
        delete obj.Name;

        caseMod.find(patientObj, "Patient", function (err, docs) {
            if (err) {
                result = { "success": false, "data": docs };
            } else {
                caseMod.count({ "PatientID": docs[0]._id }, "Case", function (err, n) {
                    if (err) {
                        result = { "success": false, "data": n }
                    } else {
                        caseNo = patientObj.PatientNo + '-' + (n + 1).toString();
                        obj["CaseNo"] = caseNo;
                        obj["PatientID"] = docs[0]._id;
                        obj["Date"] = new Date();
                        caseMod.insert(obj, "Case", function (err, r) {
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
            }
        });
    });
};

exports.caseQuery = function (req, res) {
    var postData = "";
    var result = {};
    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function () {
        var obj = JSON.parse(postData);
        caseMod.find(obj, "Patient", function (err, docs) {
            if (err) {
                result = { "success": false, "data": docs };
            } else {
                caseMod.find({ "PatientID": docs[0]._id }, "Case", function (err, docs) {
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
            }
        });
    });
};