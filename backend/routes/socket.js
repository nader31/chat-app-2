const Message = require('../models/message');
const User = require('../models/user');
const moment = require('moment');
const mongoose = require('mongoose');

//const formatMessage = require('./utils/messages');
//const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

// async function getUsername(username) {
//     try {
//         const user = await User.findOne({ username:username});
//         return user._id
//     } catch (error) {
//         console.log(error.message);
//     }
// }

module.exports = {
    connect: function(io, port) {
        io.of("/chat").on('connection', socket => {
            //socket.emit('infoMessage', 'Welcome to ChatApp from chat!');

            socket.on('joinRoom', ({username, room}) => {  
                socket.join(room);

                Message.find().then(result => {
                    socket.emit('output-messages', result);
                })
        
                socket.emit('infoMessage', {text: `Welcome to ChatApp from ${room}!`, room: room});
            
                socket.broadcast
                    .to(room)
                    .emit('infoMessage', {text: `${username} has joined ${room}`, room: room});

                socket.on('disconnect', () => {
                    socket.to(room).emit('infoMessage', {text: 'a user has left the chat', room: room});
                });
            })
        
            socket.on('message', ({username, userId, text, room}) => {
                const message = new Message({text: text, date: moment().format('h:mm a'), creator: mongoose.Types.ObjectId(userId), room: room});
                message.save().then(() => {
                    io.of('/chat').to(room).emit('message', {text: text, date: moment().format('h:mm a'), creator: username, room: room});
                })
                console.log(mongoose.Types.ObjectId(userId));
                console.log(userId);
            });
        })
    }
}