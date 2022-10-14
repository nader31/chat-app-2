const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    name: {type:String, required: true},
});

const userSchema = mongoose.Schema({
    userId: {type:mongoose.Schema.Types.ObjectId, ref: "User", required: true, required: true},
    role: {type:String, required: true},
});

const groupSchema = mongoose.Schema({
    name: { type: String, required: true},
    users: { type: [userSchema]},
    rooms: {type: [roomSchema]}
});

module.exports = mongoose.model('group', groupSchema);