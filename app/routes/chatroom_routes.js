const express = require("express");
const router = express.Router();
const Chatroom = require("../models/chatroom");

//
const passport = require('passport')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const requireToken = passport.authenticate('bearer', { session: false })
//

// get all rooms
router.get("/chatrooms", requireToken, (req, res, next) => {
    Chatroom.find()
        .then(rooms => res.status(200).json({rooms: rooms}))
        .catch(next)

  res.send({ response: "I am alive" }).status(200);
});


// create a room 
router.post("/chatrooms", requireToken, (req, res, next) => {
  req.body.room.owner = req.user.id;

  Chatroom.create(req.body.room)
    .then(room => {
        res.status(201).json({room: room.toObject()}) // send the room id back to react 
        // redirect("/chatroom"); 
    })
    .catch(next)
    
});

// returns the room obj { id} // react then sends in a socket client request tojoin a room
router.get("/chatrooms/:id", requireToken, (req, res)=>{
    Chatroom.findById(req.params.id)
        .then(handle404)
        .then(room => {
            res.status(200).json({room: room.toObject()})
        })
        .catch(next)
})



module.exports = router;
