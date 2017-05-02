var periodMod = require("../model/model").model;

exports.periodAdd = function (req, res) {
    var postData = "";
    var result = {};
    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function () {
        var obj = JSON.parse(postData);
        var periodNo = 0;
        var caseObj = { "CaseNo": obj["CaseNo"] };
        delete obj.CaseNo;

        periodMod.find(caseObj, "Case", function (err, docs) {
            if (err) {
                result = { "success": false, "data": docs };
            } else {
                periodMod.count({ "CaseID": docs[0]._id }, "Period", function (err, n) {
                    if (err) {
                        result = { "success": false, "data": n }
                    } else {
                        periodNo = caseObj.CaseNo + '-' + (n + 1).toString();
                        obj["PeriodNo"] = periodNo;
                        obj["CaseID"] = docs[0]._id;
                        periodMod.insert(obj, "Period", function (err, r) {
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

exports.periodRecord = function (req, res) {
    var postData = "";
    var result = {};
    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function () {
        var data = JSON.parse(postData);
        periodMod.update(data["period"], { $push: { "Records" : data["record"] } }, "Period", function (err, r) {
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
    });
};

exports.periodFin = function (req, res) {
    var postData = "";
    var result = {};
    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function () {
        var data = JSON.parse(postData);
        periodMod.update(data["period"], { $set: data["sum"] }, "Period", function (err, r) {
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
    });
};

exports.periodQuery = function (req, res) {
    var postData = "";
    var result = {};
    req.setEncoding("utf8");
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    req.addListener("end", function () {
        var obj = JSON.parse(postData);
        periodMod.find(obj, "Case", function (err, docs) {
            if (err) {
                result = { "success": false, "data": docs };
            } else {
                periodMod.find({ "CaseID": docs[0]._id }, "Period", function (err, docs) {
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