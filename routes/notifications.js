const { verifyToken } = require("../controllers/auth");
const { storeNotification, updateNotification } = require("../controllers/notification");
const {
    express,
    parser,
} = require('../modules');
const NOTIFICATION_ROUTES = express.Router();

// NOTIFICATION_ROUTES.get('/notification/:userId', fetch_chats);
NOTIFICATION_ROUTES.put('/notification/:id', parser, verifyToken, updateNotification);
NOTIFICATION_ROUTES.post('/notification', parser, verifyToken, storeNotification);



module.exports = NOTIFICATION_ROUTES