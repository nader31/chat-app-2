const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const User = require('../models/user');

const router = express.Router();

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            role: 'member',
            password: hash
        });
        user.save()
            .then(result => {
                console.log(result);
                res.status(201).json({
                    message: 'User created!',
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });
});

router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({ username: req.body.username})
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message:"Auth failed"
                });
            }
            const token = jwt.sign(
                {email: fetchedUser.email, role: fetchedUser.role, username: fetchedUser.username, userId: fetchedUser._id},
                'secret_nader',
                {expiresIn: "1h"}
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                username: fetchedUser.username,
                userId: fetchedUser._id,
            })
        })
        .catch(err => {
            return res.status(401).json({
                message:"Auth failed"
            })
        })
});

module.exports = router;