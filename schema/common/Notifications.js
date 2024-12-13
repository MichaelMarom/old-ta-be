const sql = require('mssql');

const Notification = {
    id: sql.UniqueIdentifier,
    senderId: sql.VarChar(200),
    receiverId: sql.VarChar(200),
    name: sql.VarChar(100),
    text: sql.VarChar(sql.MAX),
    isRead: sql.Bit,
    date: sql.DateTime,
    role: sql.VarChar(50),
};

module.exports = Notification;
