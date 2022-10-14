const mongoose = require('mongoose');

const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: 'member' }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);