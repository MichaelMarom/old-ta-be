const { express, path, morgan, socket, cors } = require('./modules');
const { ConnectToMongoDb, marom_db, connecteToDB } = require('./db')
const { STUDENT_ROUTES } = require('./routes/student');
const { ADMIN_ROUTES } = require('./routes/admin');
const { TUTOR_ROUTES } = require('./routes/tutor');
const AUTH_ROUTERS = require('./routes/auth');
const COMMON_ROUTERS = require('./routes/common')
const HOLIDAY_ROUTES = require('./routes/holiday')
const FILE_ROUTER = require('./routes/file')
const { MEETING_ROUTES } = require('./routes/meeting');
const CHAT_ROUTES = require('./routes/chat')

var { PeerServer } = require("peer");
var myPeerServer = PeerServer({ port: 8080 });

const app = express();
app.use(cors({ origin: '*' }))
app.use(morgan('tiny'));

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use('/interviews', express.static(path.join(__dirname, '/interviews')));


require('dotenv').config();

// app.use(verifyToken)
app.use(TUTOR_ROUTES);
app.use(ADMIN_ROUTES);
app.use(STUDENT_ROUTES);
app.use(AUTH_ROUTERS)
app.use(HOLIDAY_ROUTES)
app.use(FILE_ROUTER)
app.use(CHAT_ROUTES)
app.use('/api/', MEETING_ROUTES);
app.use(COMMON_ROUTERS)

var server = app.listen(process.env.PORT, () =>
    console.log('app is live @', process.env.PORT));

const io = socket(server, {
    cors: {
        origin: process.env.Remote_Base,
        credentials: true,
    },
});
const socketToUserMap = {};
const excalidraw_collaborators = new Map();
io.on('connection', socket => {
    global.chatSocket = socket;

    socket.on('DeleteSubjectRate', ({ AcademyId, subject }) => {
        console.log(AcademyId, subject)
        let deleteData = (AcademyId, subject) => {
            connecteToDB
                .then((poolConnection) =>
                    poolConnection.request().query(`DELETE FROM SubjectRates  WHERE CONVERT(VARCHAR, AcademyId) = '${AcademyId}' AND CONVERT(VARCHAR, subject) = '${subject}'`)
                        .then((result) => {
                            console.log('deleted data successfully')
                        })
                        .catch(err => console.log(err))
                )
        }
        deleteData(AcademyId, subject);
    })

    socket.on('studentIllShorList', ({ id }) => {

        let deleteData = (subject, AcademyId, Student) => {
            console.log(subject, AcademyId, Student)
            connecteToDB
                .then((poolConnection) =>
                    poolConnection.request().query(`DELETE FROM StudentShortList 
                    WHERE  CONVERT(VARCHAR, Student) =  '${Student}'
                     AND CONVERT(VARCHAR, AcademyId) =  '${AcademyId}' 
                     AND CONVERT(VARCHAR, Subject) =  '${subject}'`)
                        .then((result) => {
                            result.rowsAffected[0] ?
                                console.log('deleted data successfully') :
                                console.log('No data found to be deleted')
                        })
                        .catch(err => console.log(err))
                )
        }
        let list = id.id.split('-');
        deleteData(list[1], list[0], list[4]);
    })

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

    socket.on('offline', (id) => {
        io.emit("offline", id);
    })

    socket.on('canvas-start', (pX, pY, color, thickness, fill) => {
        socket.broadcast.emit('canvas-start', pX, pY, color, thickness, fill)

    });

    socket.on('email', (email) => {

        marom_db(async (config) => {
            const sql = require('mssql');
            console.log('uploading data...')

            var poolConnection = await sql.connect(config);
            let records = await poolConnection.request().query(`SELECT * FROM "TutorSetup" WHERE CONVERT(VARCHAR, Email) = '${email}'`)
            let get_duplicate = records.recordset;

            let result = get_duplicate.length > 0 ? false : true;

            if (!result) {
                socket.emit('email', false);

            } else {
                socket.emit('email', true);
            }

        })

    });

    socket.on('tool', (tool) => {
        socket.broadcast.emit('tool', tool)
        console.log(tool)

    });

    socket.on('fill', (checkbox) => {
        socket.broadcast.emit('fill', checkbox)

    });

    socket.on('eraser-width', (value) => {
        socket.broadcast.emit('eraser-width', value)
    });

    socket.on('note', ({ txt, y, x }) => {
        socket.broadcast.emit('note', txt, y, x)
    });

    socket.on('img', ({ img, y, x }) => {
        socket.broadcast.emit('img', img, y, x)
    });

    socket.on('accessGranted', () => {
        socket.broadcast.emit('accessGranted')
    });

    socket.on('accessRestricted', () => {
        socket.broadcast.emit('accessRestricted')
    });

    socket.on('canvas-move', (tool, cX, cY, oX, oY, pX, pY) => {
        socket.broadcast.emit('canvas-move', cX, cY, oX, oY, pX, pY)

    });

    socket.on('canvas-end', () => {
        socket.broadcast.emit('canvas-end', {})

    });

    socket.on('permissiontoUseBoardTools', id => {
        socket.broadcast.emit('permissiontoUseBoardTools', id)
    })

    socket.on('PermissionResponse', action => {
        socket.broadcast.emit('PermissionResponse', action)
    })

    socket.on('NewLecture', Info => {

        ConnectToMongoDb(async (client) => {
            try {

                let conn = await client.connect();

                if (conn) {
                    let db = client.db('mm_telecom_room_ids');
                    let coll = db.collection('_id_data');
                    let result = await coll.insertOne(Info);
                    result.acknowledged === true ? socket.emit('NewLecture', true) : socket.emit('NewLecture', false);
                }

            } catch (e) {
                console.error(e);
            }
        })
    })

    socket.on('getLecture', _ => {
        ConnectToMongoDb(async (client) => {
            try {
                let conn = await client.connect();

                if (conn) {
                    let db = client.db('mm_telecom_room_ids');
                    let coll = db.collection('_id_data');

                    let cursor = await coll.find({});
                    let result = await cursor.toArray();
                    socket.emit('getLecture', result)
                }


            } catch (e) {
                console.error(e);
            }
        })

    })

    socket.on('chat', ({ room, mssg, role }) => {
        ConnectToMongoDb(async (client) => {
            try {
                let conn = await client.connect();

                if (conn) {
                    let db = client.db('mm_telecom_room_ids');
                    let coll = await db.listCollections().toArray();
                    let filteredCollection = coll.filter(item => item.name === `room_${room}`);


                    if (filteredCollection.length === 0) {

                        new Promise((resolve, reject) => {
                            db.createCollection(`room_${room}`, async (err, res) => {
                                if (!err) {
                                    resolve()
                                } else {
                                    reject(err)
                                }
                            })
                        })
                            .then(async () => {
                                let coll = db.collection(`room_${room}`);

                                let result = await coll.insertOne({
                                    message: mssg,
                                    date: new Date,
                                    role, role

                                })

                                result.acknowledged === true ? socket.broadcast.emit('chat', mssg) : socket.broadcast.emit('chat', false);
                            })
                            .catch(err => console.log(err))



                    } else {

                        let coll = db.collection(`${filteredCollection[0].name}`);
                        let result = await coll.insertOne({
                            message: mssg,
                            date: new Date,
                            role: role
                        })

                        result.acknowledged === true ? socket.broadcast.emit('chat', mssg) : socket.broadcast.emit('chat', false);
                    }
                }
            }

            catch (err) {
                console.log(err)
            }
        })
    })

    socket.on('getChat', ({ id }) => {
        ConnectToMongoDb(async (client) => {
            try {
                let conn = await client.connect();

                if (conn) {
                    let db = client.db('mm_telecom_room_ids');
                    let coll = db.collection(`room_${id}`);

                    let cursor = await coll.find({});
                    let result = await cursor.toArray();
                    socket.emit('getChat', result)
                }


            } catch (e) {
                console.error(e);
            }
        })
    })

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
    console.log('Unhandled Rejection at:', reason.stack || reason)
    // res.status(400).send({ message: "Failed to Complete the Request!", reason: reason })

    // Recommended: send the information to sentry.io
    // or whatever crash reporting service you use
})

