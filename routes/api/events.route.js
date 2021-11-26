const express = require("express");
const MongoUtil = require('../../db/MongoUtil')
const ObjectID = require('mongodb').ObjectID;

const router = express.Router();

// add or update event
router.put("/", (req, res) => {
    let errors = { success: true, message: "" }
    console.log(req.body)

    let query = {_id: undefined}
    let update = {
        $set: {
            host: req.body.event.host,
            name: req.body.event.name,
            location: req.body.event.location,
            datetime: req.body.event.datetime,
            description: req.body.event.description,
        }
    }
    if (req.body.event._id){
        query._id =  new ObjectID(req.body.event._id)
        if (req.body.guest)
            update.$push = {RSVPs: req.body.guest}
    }else{
        query._id = new ObjectID()
        update.$set.RSVPs =  []
    }
    console.log(update)
    let options = { upsert: true }
    MongoUtil.getDB().collection('events').updateOne(query, update, options).then((result) => {
        res.send(errors)
    })
});

// get events
router.get("/", (req, res) => {
    let query = req.query.search ? {name: req.query.search} : req.query
    MongoUtil.getDB().collection('events').find(query).toArray().then(result => {
        res.send(result)
    })
});

//delete event
router.delete("/", (req, res) => {
    let query = { _id: ObjectID(req.query._id) }
    MongoUtil.getDB().collection('events').deleteOne(query).then(result => {
        res.send(result)
    })
})

module.exports = router