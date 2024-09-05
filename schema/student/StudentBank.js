const sql = require('mssql');

const StudentBank = {
    SID: sql.Int, // int(10)
    AccountName: sql.VarChar(255), // varchar(255)
    BankName: sql.VarChar(255), // varchar(255)
    AccountNumber: sql.VarChar(20), // varchar(20)
    RoutingNumber: sql.VarChar(20), // varchar(20)
    PaymentOption: sql.VarChar(50), // varchar(50)
    AcademyId: sql.VarChar(100), // varchar(100)
    PaymentType: sql.VarChar(50), // varchar(50)
    CD_Name_Pri: sql.VarChar(255), // varchar(255)
    CD_Expiry_Pri: sql.VarChar(5), // varchar(5)
    CD_Number_Pri: sql.VarChar(20), // varchar(20)
    CD_Cvc_Pri: sql.VarChar(4), // varchar(4)
    CD_Name_Sec: sql.VarChar(255), // varchar(255)
    CD_Expiry_Sec: sql.VarChar(5), // varchar(5)
    CD_Number_Sec: sql.VarChar(20), // varchar(20)
    CD_Cvc_Sec: sql.VarChar(4), // varchar(4)
    Email: sql.VarChar(255), // varchar(255)
};

module.exports = StudentBank;
