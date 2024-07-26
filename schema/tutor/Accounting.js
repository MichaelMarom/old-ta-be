const sql = require('mssql');

const Accounting = {
    id: sql.UniqueIdentifier,
    AccountName: sql.VarChar(255),
    AccountType: sql.VarChar(255),
    BankName: sql.VarChar(255),
    Account: sql.VarChar(255),
    Routing: sql.VarChar(255),
    SSH: sql.VarChar(255),
    PaymentOption: sql.VarChar(50),
    AcademyId: sql.VarChar(255),
    Email: sql.VarChar(255),
};

module.exports = Accounting;
