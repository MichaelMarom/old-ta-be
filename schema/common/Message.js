const sql = require('mssql');

const Message = {
    MessageID: sql.Int,
    Text: sql.VarChar(sql.MAX),
    ChatID: sql.Int,
    Status: sql.VarChar(50),
    Image: sql.VarChar(sql.MAX),
    Video: sql.VarChar(sql.MAX),
    Audio: sql.VarChar(sql.MAX),
    ReferenceMessageId: sql.Int,
    Date: sql.DateTime,
    Sender: sql.VarChar(255),
    Type: sql.VarChar(50),
    FileName: sql.NVarChar(255),
    FileUrl: sql.VarChar(sql.MAX),
   };

module.exports = Message;
