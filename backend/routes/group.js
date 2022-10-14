const express = require("express");
const mongoose = require('mongoose');

const checkAuth = require("../middleware/check-auth");

const Group = require('../models/group');
const User = require('../models/user');

const router = express.Router();

router.post("",
    (req, res, next) => {
    const group = new Group({
        name: req.body.name,
        users: req.body.users,
        admins: req.body.admins,
        rooms: req.body.rooms
    });
    group.save().then(createdGroup => {
        res.status(201).json({
            message: 'Group added successfully',
            groupId: createdGroup._id,
            name: createdGroup.name
        });
    });
});

router.get("", (req, res, next) => {
    Group.find()
    .then(groups => {
        res.status(200).json({
            message: 'Groups fetched successfully',
            groups: groups
        });
    });
});

router.get("/user/:id", (req, res, next) => {
    Group.find( {"users.userId": req.params.id}).then(groups => {
        if (groups) {
            res.status(200).json(groups);
        } else {
            res.status(404).json({message: 'Groups not found!'});
            console.log('groups not found');
        }
    })
});

router.get("/:groupId/user/:userId/", (req, res, next) => {
    Group.findById(req.params.groupId).then(group => {
        if (group) {
            let users = group.users;
            let user =  users.find(user => user.userId == req.params.userId );
            res.status(200).json(user);
        } else {
            res.status(404).json({message: 'Groups not found!'});
            console.log('groups not found');
        }
    })
});

router.put("/:id",
    (req, res, next) => {
    Group.findByIdAndUpdate({_id:req.params.id},req.body).then(() => {
        Group.findOne({_id:req.params.id}).then(newResult => {
            res.status(200).json(newResult);
        })

    })
})


router.get("/:id", (req, res, next) => {
    Group.findById(req.params.id).then(group => {
        if (group) {
            res.status(200).json(group);
        } else {
            res.status(404).json({message: 'Group not found!'});
        }
    })
});



module.exports = router;