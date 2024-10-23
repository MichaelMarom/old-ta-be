const sql = require('mssql');

const NewSubjectReq = {
    id: sql.Int,
    faculty: sql.VarChar(100),
    subject: sql.VarChar(sql.MAX),
    AcademyId: sql.VarChar(200),
    reason: sql.VarChar(sql.MAX),
    facultyId: sql.Int,
    IsRejected: sql.Bit,
    date: sql.DateTime

};

module.exports = NewSubjectReq;
