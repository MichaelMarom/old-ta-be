const { update, insert } = require("../utils/crud_queries");
const { marom_db } = require("../db");
const sql = require("mssql")
const { sendErrors } = require("../utils/handleReqErrors");

// General function for executing SQL queries
const executeQuery = async (query) => {
  try {
    marom_db(async (config) => {
      try {
        const sql = require("mssql");
        const poolConnection = await sql.connect(config);
        if (poolConnection) {
          const result = await poolConnection.request().query(query);
          return result;
        }
      } catch (err) {
        console.log(err);
        return err;
      }
    });
  } catch (error) {
    console.error("Error in executeQuery:", error.message);
    return error;
  }
};

// Function to update a record
const updateRecord = async (req, res) => {
  try {
    const query = update(
      req.params.table,
      req.body,
      { AcademyId: req.params.id },
      { AcademyId: "varchar" }
    );
    const result = await executeQuery(query);
    console.log(result);
    if (result?.recordSet?.length === 0) {
      throw new Error("Update failed: Record not found");
    }
    res.status(200).send(result?.recordSet);
  } catch (error) {
    sendErrors(error, res);
  }
};

// Function to get all records
const getAllRecords = async (req, res) => {
  const query = `SELECT * FROM ${req.params.table}`;

  try {
    return await executeQuery(query);
  } catch (error) {
    sendErrors(error, res);
  }
};

// Function to create a record
const createRecord = async (req, res) => {
  const query = insert(req.params.table, req.body);
  try {
    const result = await executeQuery(query, values);
    res.status(200).send(result.recordSet);
  } catch (error) {
    console.error("Error in createRecord:", error.message);
    res.status(400).send(error);
  }
};

// Function to delete a record
const deleteRecord = async (req, res) => {
  const query = `DELETE FROM ${req.params.table} WHERE AcademyId = ${req.params.id}`;

  try {
    const result = await executeQuery(query);

    if (result.recordSet.length === 0) {
      throw new Error("Delete failed: Record not found");
    }
    res.status(200).send(result.recordSet);
  } catch (error) {
    console.error("Error in deleteRecord:", error.message);
    res.status(400).send(error);
  }
};

const get_column_by_id = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const { recordset } = await poolConnection.request().query(`
            Select ${req.query.fieldName} from ${req.params.tableName} where AcademyId = '${req.params.id}'
            `);
      res.status(200).send(recordset);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};
module.exports = {
  updateRecord,
  get_column_by_id,
  deleteRecord,
  getAllRecords,
  createRecord,
  executeQuery,
};
