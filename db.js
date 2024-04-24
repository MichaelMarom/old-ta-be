require("dotenv").config();

let marom_db = async (cb) => {
  const config = {
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    server: process.env.SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_NAME,
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
