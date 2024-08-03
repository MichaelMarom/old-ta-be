const sql = require('mssql');

const AgencySchema = {
    AgencyId: sql.UniqueIdentifier, // For UNIQUEIDENTIFIER
    AgencyName: sql.NVarChar(255),  // For NVARCHAR(255)
    MainTutorId: sql.VarChar(200),  // For VARCHAR(200)
    CreatedAt: sql.DateTime,        // For DATETIME
    UpdatedAt: sql.DateTime         // For DATETIME
};

module.exports = AgencySchema;
