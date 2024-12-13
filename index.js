const { express, path, morgan, socket, cors, parser } = require('./modules');
const { marom_db } = require('./db')
const sql = require('mssql')
const { STUDENT_ROUTES } = require('./routes/student');
const { ADMIN_ROUTES } = require('./routes/admin');
const { TUTOR_ROUTES } = require('./routes/tutor');
const AUTH_ROUTERS = require('./routes/auth');
const COMMON_ROUTERS = require('./routes/common')
const HOLIDAY_ROUTES = require('./routes/holiday')
const FILE_ROUTER = require('./routes/file')
const { MEETING_ROUTES } = require('./routes/meeting');
const CHAT_ROUTES = require('./routes/chat')
const AGENCY_ROUTES = require('./routes/agency')
const webpush = require("web-push");

require('dotenv').config();

let { PeerServer } = require("peer");
const { sendErrors } = require('./utils/handleReqErrors');
let myPeerServer = PeerServer({ port: process.env.PEER_SERVER_PORT });

const app = express();
app.use(cors({ origin: process.env.FE_URL }))
app.use(morgan('tiny'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.get('/', (req, res) => res.send({ message: 'Hello world!', base: process.env.FE_URL }))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/interviews', express.static(path.join(__dirname, '/interviews')));

// mark tutor and student ads expired after 7 days from azure function
app.put('/api/update-expire-ads', parser, (req, res) => {
    marom_db(async (config) => {
        try {
            const poolConnection = await sql.connect(config);
            const result = await poolConnection
                .request()
                .query(`UPDATE TutorAds
                SET Status = 'expired', Published_At = NULL
                WHERE Published_At < DATEADD(DAY, -7, GETDATE())`);

            const studentAdsUpdates = await poolConnection
                .request()
                .query(`UPDATE StudentAds
                SET Status = 'expired', Published_At = NULL
                WHERE Published_At < DATEADD(DAY, -7, GETDATE())`);

            res.status(200).send({ tutorAds: result, studentAds: studentAdsUpdates });
        } catch (err) {
            sendErrors(err, res)
        }
    });
})

const vapidKeys = {
    publicKey: process.env.WED_PUSH_PUBLIC_KEY,
    privateKey: process.env.WED_PUSH_PRIVATE_KEY,
  };
  
  
  webpush.setVapidDetails(
    "mailto:admin@tutoring-academy.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )
  
  let subscriptions = [];
  
  app.post("/subscribe", (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription);
  
    res.status(201).json({status: "success"});
  });
  
  app.post("/send-notification", (req, res) => {
    const notificationPayload = {
        title: "New Notification",
        body: "This is a new notification",
        icon: "https://some-image-url.jpg",
        data: {
          url: "https://example.com",
        },
    };
  
    Promise.all(
      subscriptions.map((subscription) =>
        webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
      )
    )
      .then(() => res.status(200).json({ message: "Notification sent successfully." }))
      .catch((err) => {
        console.error("Error sending notification");
        res.sendStatus(500);
      });
  });


app.use(TUTOR_ROUTES);
app.use(AGENCY_ROUTES);
app.use(ADMIN_ROUTES);
app.use(STUDENT_ROUTES);
app.use(AUTH_ROUTERS)
app.use(HOLIDAY_ROUTES)
app.use(FILE_ROUTER)
app.use(CHAT_ROUTES)
app.use('/api/', MEETING_ROUTES);
app.use(COMMON_ROUTERS)

let server = app.listen(process.env.PORT, () =>
    console.log('app is live @', process.env.PORT));


const io = socket(server, {
    cors: {
        origin: process.env.FE_URL,
        credentials: true,
    },
});
app.set("socketio", io); //// Pass io to your controller
const socketToUserMap = {};
const excalidraw_collaborators = new Map();

io.on('connection', socket => {
    global.chatSocket = socket;

    //collab video streaming
    socket.on('join-room', (room_id, user_id) => {

        socket.join(room_id);
        socket.broadcast.to(room_id).emit("user-connected", user_id);

        socket.on('disconnect', () => {
            socket.broadcast.to(room_id).emit('user-disconnected', user_id);
        })

    });

    //excalidraw/canvas/session
    socket.on('join-session', (sessionId) => {
        socket.join(sessionId);
        console.log('User', socket.id, ' joined session ', sessionId)
    })

    socket.on('authorize-student', (data) => {
        const { sessionId } = data;
        socket.to(sessionId).emit("recieve-authorization", data);
    })

    socket.on('canvas-change', (data) => {
        if (data) {
            const { sessionId = '', elements = [], appState = {}, collaborator = {}, files } = data;
            excalidraw_collaborators.set(collaborator.AcademyId, collaborator);
            sessionId.length && socket.to(sessionId).emit("canvas-change-recieve",
                { elements, appState, collaborators: JSON.stringify([...excalidraw_collaborators]), files });
        }
    });

    socket.on('activeTool', (data) => {
        if (data) {
            const { activeTool = {}, sessionId = '' } = data;
            sessionId?.length && socket.to(sessionId).emit("active-tool-change",
                { activeTool });
        }
    });

    //add in session/canvas chat
    socket.on("session-add-user", (sessionId) => {
        socket.join(sessionId)
        console.log('User', socket.id, ' joined room ', sessionId)
    });
    socket.on("session-send-msg", (data) => {
        const { text, sessionId } = data;
        console.log(`From session Message:${text}, sent from ${sessionId}`);
        socket.to(sessionId).emit("session-msg-recieve", data);
    });

    //message board tab
    socket.on("add-user", (roomId) => {
        socket.join(roomId)
        console.log('User', socket.id, ' joined room ', roomId)
    });

    socket.on("send-msg", (data) => {
        const { to, text, room } = data
        console.log(`Message:${text} sent from room:${room} to ${to}`);
        socket.to(room).emit("msg-recieve", data);
    });

    socket.on('online', (id, role) => {
        socketToUserMap[socket.id] = { userId: id, role };
        io.emit("online", id);
    })

    socket.on('offline', (id, role) => {
        io.emit("offline", id, role);
    })

    //disconnect
    socket.on('disconnect', (error) => {
        const { userId = null, role = null } = socketToUserMap?.[socket.id] || {};
        io.emit("offline", userId, role, 'disconn')
        console.log('disonnecting ', userId, role, ' due to', error, socket.id)
    })

});

myPeerServer.on("connection", function ({ id }) {
    console.log(id + " has connected to the PeerServer");
});

myPeerServer.on("disconnect", function ({ id }) {
    console.log(id + " has disconnected from the PeerServer");
});

process.on('unhandledRejection', (reason, promise) => {
    try {
        console.log('Unhandled Rejection at:', reason.stack || reason)

        // Recommended: send the information to sentry.io
        // or whatever crash reporting service you use}
    } catch (err) {
        console.log('Unhandled Rejection at:', reason.stack || reason)
    }
})

