const sql = require('mssql');

const CodeApplicationLogs = {
    id: sql.UniqueIdentifier,
    tutorId: sql.VarChar(200),
    studentId: sql.VarChar(200),
    codeApplied: sql.Bit,
    date: sql.DateTime,
    SubjectRateCodeRef: sql.Int,

};

module.exports = CodeApplicationLogs;
