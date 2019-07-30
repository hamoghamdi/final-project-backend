const express = require("express");
const router = express.Router();
const Chatroom = require("../models/chatroom");

//
const passport = require('passport')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
const User = require("../models/user");
//

// get all rooms
router.get("/chatrooms", requireToken, (req, res, next) => {
    Chatroom.find()
        .then(rooms => res.status(200).json({rooms: rooms}))
        .catch(next)
});

// get user's rooms 
router.get("/myrooms", requireToken, (req, res, next) => {
  User.findById(req.user.id)
    .populate("rooms")
    .then(user => {
      res.status(200).json({ rooms: user.rooms });
    })
    .catch(next);
});

// create a room 
router.post("/chatrooms", requireToken, (req, res, next) => {
  req.body.room.owner = req.user.id;

  Chatroom.create(req.body.room)
    .then(room => {
        res.status(201).json({room: room.toObject()}) // send the room id back to react 
    
    })
    .catch(next)
    
});

// returns the room obj { id} // react then sends in a socket client request tojoin a room
router.get("/chatrooms/:id", requireToken, (req, res, next)=>{
    Chatroom.findById(req.params.id)
        .then(handle404)
        .then(room => {
            res.status(200).json({room: room.toObject()})
        })
        .catch(next)
})

router.delete("/chatrooms/:id", requireToken, (req, res, next) => {
  Chatroom.findById(req.params.id)
    .then(handle404)
    .then(room => {
      requireOwnership(req, room);
      room.remove();
    })
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next);
});


module.exports = router;
