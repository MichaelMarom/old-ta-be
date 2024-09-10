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
    tutorScreenName: sql.NVarChar(200),
    invoiceNum: sql.VarChar(100),
    request: sql.VarChar(100),
    ratingByStudent: sql.Decimal(3, 2),  
    commentByStudent: sql.NVarChar(sql.MAX),
    ratingByTutor: sql.Decimal(3, 2),  
    commentByTutor: sql.NVarChar(sql.MAX),
    tutorFeedbackEligible: sql.Bit
};

module.exports = Lessons;
