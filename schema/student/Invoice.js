const sql = require('mssql');

const Invoice = {
    InvoiceId: sql.NVarChar(200),
    StudentId: sql.VarChar(100),
    TutorId: sql.VarChar(100),
    BookingFee: sql.Decimal(18, 2), 
    TotalLessons: sql.Int,
    DiscountAmount: sql.Decimal(18, 2), 
    InvoiceDate: sql.DateTime
};

module.exports = Invoice;
