const sql = require('mssql');

const Notification = {
    id: sql.UniqueIdentifier,       // Unique identifier for the notification
    senderId: sql.VarChar(200),     // ID of the sender (student, tutor, or admin)
    receiverId: sql.VarChar(200),   // ID of the receiver
    name: sql.VarChar(100),         // Notification name or type
    text: sql.VarChar(sql.MAX),     // Notification message content
    isRead: sql.Bit,                // Read/unread status (1 for read, 0 for unread)
    date: sql.DateTime,             // Creation date and time
    role: sql.VarChar(50),          // Role of the sender (student, tutor, or admin)
};

module.exports = Notification;
