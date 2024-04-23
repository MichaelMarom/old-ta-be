require("dotenv").config();

let marom_db = async (cb) => {
  const config = {
    user: process.env.USER_NAME, // better stored in an app setting such as process.env.DB_USER
    password: process.env.PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
    server: process.env.SERVER, // better stored in an app setting such as process.env.DB_SERVER
    port: parseInt(process.env.DB_PORT), // optional, defaults to parseInt(process.env.DB_PORT), better stored in an app setting such as parseInt(process.env.DB_PORT)
    database: process.env.DB_NAME, // better stored in an app setting such as process.env.DB_NAME
    authentication: {
      type: "default",
    },

    options: {
      encrypt: true,
      requestTimeout: 300000,
    },
  };

  cb(config);
};

module.exports = {
  marom_db,
};
