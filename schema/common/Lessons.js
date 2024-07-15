const sql = require('mssql');

const Lessons = {
    id: sql.UniqueIdentifier,
    start: sql.DateTime,
    end: sql.DateTime,
    subject: sql.NVarChar(100),
    type: sql.NVarChar(50),
    title: sql.NVarChar(100),
    studentName: sql.NVarChar(200),
    studentId: sql.NVarChar(200),
    createdAt: sql.DateTime,
    tutorId: sql.NVarChar(200),
    rate: sql.Decimal(10, 2), 
    feedbackEligible: sql.Bit,
    rating: sql.Decimal(3, 2),  
    comment: sql.NVarChar(sql.MAX),
    invoiceNum: sql.VarChar(100),
    request: sql.VarChar(100)
};

module.exports = Lessons;
