const { marom_db } = require("../db");
const sql = require("mssql");
const {
  parameterizedInsertQuery,
  parameteriedUpdateQuery,
} = require("../helperfunctions/crud_queries");
const { sendErrors } = require("../helperfunctions/handleReqErrors");
const AgencySchema = require("../schema/agency/agency");
const SubTutorsSchema = require("../schema/agency/subTutor");
const { capitalizeFirstLetter } = require("../constants/helperfunctions");
const { shortId } = require("../modules");

const createAgencyApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      Object.keys(req.body).map((key) =>
        request.input(key, AgencySchema[key], req.body[key])
      );

      const { recordset } = await request.query(
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
        ...req.body,
        AgencyId: req.params.id,
        UpdatedAt: new Date(),
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

// sub-tutors

const createSubTutorApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();
      const { agencyId } = req.params;
      let insertedSubTutor = { ...req.body, AgencyId: agencyId };

      let TutorId = `${capitalizeFirstLetter(insertedSubTutor.FirstName)}${capitalizeFirstLetter(insertedSubTutor.LastName[0])
      }${shortId.generate()}`

      insertedSubTutor = {...insertedSubTutor, TutorId}

      Object.keys(insertedSubTutor).map((key) =>
        request.input(key, SubTutorsSchema[key], insertedSubTutor[key])
      );

      const { recordset } = await request.query(
        parameterizedInsertQuery("SubTutors",insertedSubTutor).query
      );
      res.status(200).send(recordset[0]);
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const updateSubTutorApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      const wholeUpdateObject = {
        ...req.body,
        SubTutorId: req.params.id,
        UpdatedAt: new Date(),
      };
      Object.keys(wholeUpdateObject).map((key) =>
        request.input(key, SubTutorsSchema[key], wholeUpdateObject[key])
      );

      const { rowsAffected } = await request.query(
        parameteriedUpdateQuery(
          "SubTutors",
          req.body,
          { SubTutorId: req.params.id },
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

const deleteSubTutorApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      const { rowsAffected } = await request.query(
        `Delete from SubTutors where AgencyId = "${req.params.id}"`
      );
      res.status(200).send({ deleted: rowsAffected[0] });
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const getSubtutorApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      const { recordset } = await request.query(
        `Select * from SubTutors where SubTutorId = '${req.params.id}'`
      );
      res.status(200).send(recordset[0] || {});
    } catch (err) {
      sendErrors(err, res);
    }
  });
};

const getSubTutorsByAgencyApi = async (req, res) => {
  marom_db(async (config) => {
    try {
      const poolConnection = await sql.connect(config);
      const request = await poolConnection.request();

      const { recordset } = await request.query(`SELECT * from SubTutors where AgencyId = '${req.params.agencyId}'`);
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
  createSubTutorApi,
  updateSubTutorApi,
  deleteSubTutorApi,
  getSubtutorApi,
  getSubTutorsByAgencyApi,
};
