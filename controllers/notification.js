const sql = require('mssql');
const { marom_db } = require('../db');
const { parameterizedInsertQuery, parameteriedUpdateQuery } = require('../utils/crud_queries');
const { sendErrors } = require('../utils/handleReqErrors');
const Notification = require('../schema/common/Notifications');



let storeNotification = (req, res) => {
    marom_db(async (config) => {
      try {
        const poolConnection = await sql.connect(config);
        const request = poolConnection.request();
  
        // Bind each key-value pair in the body to the SQL query
        Object.keys(body).map((key) =>
          request.input(key, Notification[key], body[key])
        );
  
        // Insert query
        const { recordset } = await request.query(
          parameterizedInsertQuery("Notifications", body).query
        );
  
        // Send success response
        res.status(200).send(recordset);
      } catch (err) {
        sendErrors(err, res);
      }
    });
  };
  
  let updateNotification = (req, res) => {
    marom_db(async (config) => {
      try {
        let poolConnection = await sql.connect(config);
        const request = poolConnection.request();
        const { id } = req.params;
        // Combine req.body and id, and map the keys to inputs for SQL request
        Object.keys({ ...req.body, id }).map((key) =>
          request.input(key, Notification[key], { ...req.body, id }[key])
        );
        // Execute the query dynamically with parameterized update query
        const result = await request.query(
          parameteriedUpdateQuery("Notifications", req.body, req.params, {}, false)
            .query
        );
  
        res.status(200).send({ updated: result.rowsAffected[0] });
      } catch (err) {
        sendErrors(err, res);
      }
    });
  };


  module.exports = {
    storeNotification,
    updateNotification,
  };


// In the crud_queries.js file: