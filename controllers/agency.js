const { marom_db } = require("../db");
const sql = require("mssql");
const {
  parameterizedInsertQuery,
  parameteriedUpdateQuery,
} = require("../helperfunctions/crud_queries");
const { sendErrors } = require("../helperfunctions/handleReqErrors");
const AgencySchema = require("../schema/agency/agency");

const createAgencyApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      Object.keys(req.body).map((key) =>
        request.input(key, AgencySchema[key], req.body[key])
      );

      const {recordset} = await request.query(
        parameterizedInsertQuery("Agencies", req.body).query
      );
      res.status(200).send(recordset[0]);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const updateAgencyApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      const wholeUpdateObject = {
        AgencyId: req.params.id,
        UpdatedAt: new Date(),
        ...request.body,
      };
      Object.keys(wholeUpdateObject).map((key) =>
        request.input(key, AgencySchema[key], wholeUpdateObject[key])
      );

      const { rowsAffected } = await request.query(
        parameteriedUpdateQuery(
          "Agencies",
          req.body,
          { AgencyId: req.params.id },
          {},
          false
        ).query
      );
      res.status(200).send({ updated: rowsAffected[0] });
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const deleteAgencyApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      const { rowsAffected } = await request.query(
        `Delete from Agencies where AgencyId = "${req.params.id}"`
      );
      res.status(200).send({ deleted: rowsAffected[0] });
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const getAgencyApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      const { recordset } = await request.query(
        `Select * from Agencies where AgencyId = '${req.params.id}'`
      );
      res.status(200).send(recordset[0] || {});
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const getAgenciesApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      const { recordset } = await request.query(`SELECT * from Agencies`);
      res.status(200).send(recordset);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

module.exports = {
  createAgencyApi,
  updateAgencyApi,
  deleteAgencyApi,
  getAgencyApi,
  getAgenciesApi,
};
