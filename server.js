// require necessary NPM packages
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

// require route files
const exampleRoutes = require('./app/routes/example_routes')
const userRoutes = require('./app/routes/user_routes')
const chatroomRoutes = require('./app/routes/chatroom_routes')

// require error handling middleware
const errorHandler = require('./lib/error_handler')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require('./config/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// required middleware to log requests
const requestLogger = require('./lib/request_logger')

// require middleware for accepting token or bearer
const tokenOrBearer = require('./lib/token_or_bearer')

// Define Ports
const reactPort = 7165
const expressPort = 3000

// establish database connection
mongoose.Promise = global.Promise
mongoose.connect(db, {
  useMongoClient: true
})

// instantiate express application object
const app = express()

const server = require("http").Server(app);
const socketIO = require("socket.io");

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${reactPort}`}))

// define port for API to run on
const port = process.env.PORT || expressPort

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token <token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use(tokenOrBearer)

// register passport authentication middleware
app.use(auth)

// add `bodyParser` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(bodyParser.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(bodyParser.urlencoded({ extended: true }))

// add request logger to create server log
app.use(requestLogger)

// register route files
app.use(exampleRoutes)
app.use(userRoutes)
app.use(chatroomRoutes)

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

const io = socketIO(server);

let onlineUsers = {}; // {room: [ {socketId: "value", username: "value" } ]
io.sockets.on("connection", socket => {
  console.log("New client connected");
  // let room
  // let socketId = socket.id
  socket.on("subscribe", (data)=> {
    console.log("joining room", data.room);
    socket.join(data.room);
    // room = data.room
    // if (socket.rooms) {
    //   socket.rooms[data.room] = data.room
    // } else {
    //   socket.rooms = {[data.room]: data.room}
    // }
    // recive room and username from prompt
    // data =  {room: data.room, userName: data.userName}
    // socket.roomId = data.room
    // room = data.room
    // socket.username = data
    // data.id = socket.id
    // onlineUsers.push(data);
    if (onlineUsers[data.room]) {
      onlineUsers[data.room].push({socketId: socket.id, username: data.userName});
    } else {
      onlineUsers[data.room] = [{
        socketId: socket.id,
        username: data.userName
      }];
    }

    // console.log('online users', onlineUsers)
    // socketUsers[data.room] = [];
    // for (let member in io.sockets.adapter.rooms[data.room]) {
    //   socketUsers[data.room].push(member);
    // }
    // console.log("sockets users sign in", io.sockets.adapter.rooms[data.room]);
    io.sockets.in(data.room).emit("online users", onlineUsers[data.room]);


  });

  socket.on("unsubscribe", (room)=> {
    console.log("leaving room unsubscribe", room);
    socket.leave(room);
  });


  socket.on("send", (data)=> {
    console.log(data)
    io.sockets.in(data.room).emit("message", data);
  })

    socket.on("forceDisconnect", (roomId) => {
      // console.log("hello", roomid);
      // console.log("disc roomid", roomid)
      // console.log("disc socket.id", socket.id)
      // console.log("online users", onlineUsers)
      // console.log("original socketid", socketId);
      // let originalSocket = io.sockets.connected[socketId]
      socket.leave(roomId);
      onlineUsers[roomId] = onlineUsers[roomId].filter(user => user.socketId !== socket.id)

      io.sockets.in(roomId).emit("online users", onlineUsers[roomId]);

      // console.log("disc sockets users", io.sockets.adapter.rooms[roomid]); 
      // socket.leave(roomid);
      // console.log("sockets users",io.sockets.adapter.rooms[roomid]); 
      // console.log('socketId', socketId)
      // console.log("onlineUsers", onlineUsers);
      // socket.disconnect()
      // io.sockets.in(data.room).emit("message", data);
    });
  // disconnect is fired when a client leaves the server
  // once insted of on
  socket.on("disconnect", () => {
    console.log("user disconnected");
    // console.log("sockets users", io.sockets.adapter.rooms[data.room]);    
    // for ( let roomId in io.sockets.adapter.rooms) {
      // socket.leave(onlineUsers[socket.id])
    // }
    // onlineUsers = onlineUsers.filter(element => element != socket.username);
    // console.log("leaving room id ", room);
    // console.log("leaving room username ", socket.username);

    // socket.leave(Object.keys(socket.rooms)[0]);

    // io.sockets.in(socket.roomId).emit("online users", onlineUsers);
    
  });

});
onlineUsers = [];

//---

// run API on designated port (3000 in this case)
// app.listen(port, () => {
//   console.log('listening on port ' + port)
// })
server.listen(port, () =>
  console.log(`Listening on socketPort ${port}`)
);
// needed for testing
module.exports = app

  /* 
  socket.on("new user", data => {
    console.log("new user joined ", data.userName);
    socket.username = data.userName;
    io.sockets.emit("new user", data.userName);
    

    onlineUsers.push(data.userName);
    io.sockets.in(data.room).emit("online users", onlineUsers);
  });
  */