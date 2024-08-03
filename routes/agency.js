
const { createAgencyApi, updateAgencyApi, deleteAgencyApi, getAgencyApi, getAgenciesApi } = require('../controllers/agency');
const { verifyToken } = require('../controllers/auth');
const { express, parser } = require('../modules');

const AgencyRoutes = express.Router();

AgencyRoutes.post('/agency', parser, verifyToken, createAgencyApi)
AgencyRoutes.put('/agency/:id', parser, verifyToken, updateAgencyApi)
AgencyRoutes.delete('/agency/:id', verifyToken, deleteAgencyApi)
AgencyRoutes.get('/agency/:id', verifyToken, getAgencyApi)
AgencyRoutes.get('/agency', verifyToken, getAgenciesApi)


module.exports = AgencyRoutes

