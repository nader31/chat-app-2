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
            socket.on('joinRoom', async ({username, room, group}) => {
                socket.join(room);
                socket.data.username = username;

                let connectedUsers = [];
                const sockets = await io.of("/chat").in(room).fetchSockets();


                for (const socket of sockets) {
                    connectedUsers.push(socket.data.username);
                }
                console.log('connectedUsers: ');
                console.log(connectedUsers);
                console.log('------');

                socket.emit('connected-users', {users: connectedUsers,room: room, group: group});
                socket.broadcast.emit('connected-users', {users: connectedUsers,room: room, group: group});

                Message.find().then(result => {
                    socket.emit('output-messages', result);
                })
        
                socket.emit('infoMessage', {text: `Welcome to ChatApp from ${room}!`, room: room, group: group});

                socket.broadcast
                    .to(room)
                    .emit('infoMessage', {text: `${username} has joined ${room}`, room: room, group: group});
                    console.log(`${username} has joined ${room}` + ', group: ' + group);
                
                socket.on('disconnect', () => {
                    socket.to(room).emit('infoMessage', {text: 'a user has left the chat', room: room, group: group});
                });
            })
            socket.on('leaveRoom', async ({username, room, group}) => {
                console.log(username +' left : ', room);
                socket.leave(room);
                socket.to(room).emit('infoMessage', {text: `${username} has left ${room}`, room: room, group: group});
                let connectedUsers = [];
                const sockets = await io.of("/chat").in(room).fetchSockets();

                for (const socket of sockets) {
                    connectedUsers.push(socket.data.username);
                }
                socket.emit('connected-users', {users: connectedUsers,room: room, group: group});
                socket.broadcast.emit('connected-users', {users: connectedUsers,room: room, group: group});
            })
        
            socket.on('message', ({username, userId, text, room, group, image}) => {
                const message = new Message({text: text, creator: mongoose.Types.ObjectId(userId), room: room, group: mongoose.Types.ObjectId(group), image:image});
                message.save().then(() => {
                    io.of('/chat').to(room).emit('message', {text: text, date: Date.now(), creator: username, room: room, group: group, image: image});
                })
                console.log(mongoose.Types.ObjectId(userId));
                console.log(userId);
            });
        })
    }
}