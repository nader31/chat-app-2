const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    text: { type: String, required: true },
    date: { type: Date, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model('message', messageSchema);