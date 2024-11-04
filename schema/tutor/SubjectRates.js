const sql = require("mssql")

const SubjectRate = {
    SID: sql.Int,
    faculty: sql.VarChar(sql.MAX),
    subject: sql.VarChar(sql.MAX),
    rate: sql.VarChar(sql.MAX),
    AcademyId: sql.VarChar(sql.MAX),
    grades: sql.VarChar(sql.MAX),
    DiscountCode: sql.VarChar(sql.MAX),
    CodeStatus: sql.VarChar(sql.MAX),
}
module.exports = SubjectRate