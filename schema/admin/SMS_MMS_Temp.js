const sql = require('mssql');

const SMS_MMS_Temp = {
    id: sql.Int,
    text: sql.VarChar(sql.MAX),
    name: sql.VarChar(255),
    attachment: sql.VarBinary(sql.MAX),
    fileName: sql.VarChar(255),
};

module.exports = SMS_MMS_Temp;
