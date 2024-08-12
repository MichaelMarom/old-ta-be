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
      encrypt: true, 
      enableArithAbort: true,
      "trustServerCertificate": true
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
  };
  // console.log(config)
  return cb(config);
};
(async () => {
  try {
    marom_db(async(config)=>{
      await sql.connect(config)
      const {recordset} = await sql.query`select 1+1 as sum`
      console.dir(recordset[0])
    })
  } catch (err) {
    console.log(err, 'Errors')
  }

})()

module.exports = {
  marom_db,
};
