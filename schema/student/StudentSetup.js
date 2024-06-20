const sql = require('mssql');

const StudentSetup = {
    SID: sql.Int,
    FirstName: sql.VarChar(sql.MAX), // since text type in SQL server can store up to 2GB of data
    MiddleName: sql.VarChar(sql.MAX),
    LastName: sql.VarChar(sql.MAX),
    Email: sql.VarChar(sql.MAX),
    Cell: sql.VarChar(sql.MAX),
    Language: sql.VarChar(sql.MAX),
    AgeGrade: sql.VarChar(sql.MAX),
    Grade: sql.VarChar(sql.MAX),
    Address1: sql.VarChar(sql.MAX),
    Address2: sql.VarChar(sql.MAX),
    City: sql.VarChar(sql.MAX),
    State: sql.VarChar(sql.MAX),
    ZipCode: sql.VarChar(sql.MAX),
    Country: sql.VarChar(sql.MAX),
    GMT: sql.VarChar(sql.MAX),
    AcademyId: sql.VarChar(sql.MAX),
    ScreenName: sql.VarChar(sql.MAX),
    Photo: sql.VarChar(sql.MAX),
    Status: sql.VarChar(sql.MAX),
    ParentConsent: sql.VarChar(sql.MAX),
    Online: sql.Bit,
    userId: sql.VarChar(100),
    ParentAEmail: sql.VarChar(50),
    ParentBEmail: sql.VarChar(50),
    ParentAName: sql.VarChar(50),
    ParentBName: sql.VarChar(50),
    SecLan: sql.VarChar(255),
    AgreementDate: sql.DateTime
};

module.exports = StudentSetup;
