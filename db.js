require("dotenv").config();
const sql = require("mssql")

let marom_db = async (cb) => {
  const config = {
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
    options: {
      encrypt: true, // Use encryption
      enableArithAbort: true,
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
  };

  cb(config);
};
(async () => {
  try {
    const config = {
      user: process.env.USER_NAME,
      password: process.env.PASSWORD,
      server: process.env.SERVER,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      options: {
        encrypt: true, // Use encryption
        enableArithAbort: true,
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      },
      connectionTimeout: 30000,
      requestTimeout: 30000 // Increase request timeout to 30 seconds
    };

    // make sure that any items are correctly URL encoded in the connection string

    await sql.connect(config)

    const {recordset} = await sql.query`select 1+1 as sum`
    
    console.dir(recordset[0])
  } catch (err) {
    console.log(err, 'Errors')
    // ... error checks

  }

})()

module.exports = {
  marom_db,
};
