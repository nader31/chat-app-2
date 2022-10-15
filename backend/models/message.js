const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    text: { type: String},
    date: { type: String, default: () => Date.now() },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: {type: String, required: true},
    group: {type: String},
    image: {type: String}
});

module.exports = mongoose.model('message', messageSchema);