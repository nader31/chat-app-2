const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require("./routes/user");
const groupRoutes = require("./routes/group");

const app = express();

mongoose.connect("mongodb+srv://nader:xK8P3A2xHAbw7r9u@cluster0.8y255sp.mongodb.net/chat-app")
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection failed!')
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-Width, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/user", userRoutes);
app.use("/api/group", groupRoutes);

module.exports = app;