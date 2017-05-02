var patientCtr = require("./controller/patientCtr");
var caseCtr = require("./controller/caseCtr");
var periodCtr = require("./controller/periodCtr");

exports.router={
    "/patient/add": patientCtr.patientAdd,
    "/patient/query": patientCtr.patientQuery,
    "/case/add": caseCtr.caseAdd,
    "/case/query": caseCtr.caseQuery,
    "/period/add": periodCtr.periodAdd,
    "/period/record": periodCtr.periodRecord,
    "/period/fin": periodCtr.periodFin,
    "/period/query": periodCtr.periodQuery
};