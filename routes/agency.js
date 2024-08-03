
const { createAgencyApi, updateAgencyApi, deleteAgencyApi, getAgencyApi, getAgenciesApi } = require('../controllers/agency');
const { verifyToken } = require('../controllers/auth');
const { express, parser } = require('../modules');

const AgencyRoutes = express.Router();

AgencyRoutes.post('/agency', parser, verifyToken, createAgencyApi)
AgencyRoutes.put('/agency/:id', parser, verifyToken, updateAgencyApi)
AgencyRoutes.delete('/agency/:id', verifyToken, deleteAgencyApi)
AgencyRoutes.get('/agency/:id', verifyToken, getAgencyApi)
AgencyRoutes.get('/agency', verifyToken, getAgenciesApi)
// subtutor

AgencyRoutes.post('/agency/:agencyId/sub-tutor', parser, verifyToken, createAgencyApi)
AgencyRoutes.put('/agency/sub-tutor/:id', parser, verifyToken, updateAgencyApi)
AgencyRoutes.delete('/agency/sub-tutor/:id', verifyToken, deleteAgencyApi)
AgencyRoutes.get('/agency/sub-tutor/:id', verifyToken, getAgencyApi)
AgencyRoutes.get('/agency/:agencyId/sub-tutors', verifyToken, getAgenciesApi)


module.exports = AgencyRoutes
