const sql = require("mssql");

const SubTutorsSchema = {
  SubTutorId: sql.UniqueIdentifier, // For UNIQUEIDENTIFIER
  AgencyId: sql.VarChar(200), // For VARCHAR(200)
  TutorId: sql.VarChar(200),
  FirstName: sql.NVarChar(255), // For NVARCHAR(255)
  LastName: sql.NVarChar(255), // For NVARCHAR(255)
  Email: sql.NVarChar(255), // For NVARCHAR(255)
  Phone: sql.VarChar(20), // For VARCHAR(20)
  Country: sql.NVarChar(100), // For NVARCHAR(100)
  Subject: sql.VarChar(200), // For VARCHAR(200)
  Faculty: sql.Int, // For INT
  CreatedAt: sql.DateTime, // For DATETIME
  UpdatedAt: sql.DateTime, // For DATETIME
};

module.exports = SubTutorsSchema;
