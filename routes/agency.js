
const { createAgencyApi, updateAgencyApi, deleteAgencyApi, getAgencyApi, getAgenciesApi, createSubTutorApi, updateSubTutorApi, deleteSubTutorApi, getSubtutorApi, getSubTutorsByAgencyApi } = require('../controllers/agency');
const { verifyToken } = require('../controllers/auth');
const { express, parser } = require('../modules');

const AgencyRoutes = express.Router();

AgencyRoutes.post('/agency', parser, verifyToken, createAgencyApi)
AgencyRoutes.put('/agency/:id', parser, verifyToken, updateAgencyApi)
AgencyRoutes.delete('/agency/:id', verifyToken, deleteAgencyApi)
AgencyRoutes.get('/agency/:id', verifyToken, getAgencyApi)
AgencyRoutes.get('/agency', verifyToken, getAgenciesApi)
// subtutor

AgencyRoutes.post('/agency/:agencyId/sub-tutor', parser, verifyToken, createSubTutorApi)
AgencyRoutes.put('/agency/sub-tutor/:id', parser, verifyToken, updateSubTutorApi)
AgencyRoutes.delete('/agency/sub-tutor/:id', verifyToken, deleteSubTutorApi)
AgencyRoutes.get('/agency/sub-tutor/:id', verifyToken, getSubtutorApi)
AgencyRoutes.get('/agency/:agencyId/sub-tutors', verifyToken, getSubTutorsByAgencyApi)


module.exports = AgencyRoutes
