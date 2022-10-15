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
                {email: fetchedUser.email, role: fetchedUser.role, username: fetchedUser.username, userId: fetchedUser._id, image: fetchedUser.image},
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

// Get all the users
router.get("",(req, res, next) => {
    User.find()
        .then(users => {
            let usersArray = [];
            users.forEach(user => {
                usersArray.push({id:user._id, username: user.username});
            });
            res.status(200).json(usersArray);
        });
});

router.get("/:id",(req,res,next) => {
    if (req.params.id.length > 10) {
        User.findById(req.params.id).then(user => {
            if (user) {
                res.status(200).json(user);
                console.log(user);
            } else {
                res.status(404).json({message: 'User not found!'});
                console.log('user not found');
            }
        })
    } else {
        console.log('id not found',req.params.id);
    }
})

router.get("/:id/role",(req,res,next) => {
    User.findById(req.params.id).then(user => {
        if (user) {
            res.status(200).json(user.role);
            console.log(user.role);
        } else {
            res.status(404).json({message: 'User not found!'});
            console.log('user not found');
        }
    })
})

router.get("/username/:username",(req,res,next) => {
    User.findOne({username: req.params.username}).then(user => {
        if (user) {
            res.status(200).json(user);
            console.log(user);
        } else {
            res.status(404).json({message: 'User not found!'});
            console.log('user not found');
        }
    })
})

router.put("/:id",
    (req, res, next) => {
    User.findByIdAndUpdate({_id:req.params.id},req.body).then(() => {
        User.findOne({_id:req.params.id}).then(newResult => {
            res.status(200).json(newResult);
        })

    })
})

module.exports = router;