const Message = require('../models/message');

//const formatMessage = require('./utils/messages');
//const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

module.exports = {
    connect: function(io, port) {
        io.of("/chat").on('connection', socket => {
            socket.emit('message', 'Welcome to ChatApp from chat!');

            socket.on('joinRoom', (room) => {  
                socket.join(room);
        
                // Welcome current user
                socket.emit('message', `Welcome to ChatApp from ${room}!`);
            
                // Broadcast when a user connects (emit to everybody except the user connected)
                socket.broadcast
                    .to(room)
                    .emit(
                        'message', `${'nader'} has joined ${room}`
                    );
                
                // Send users and room info
                // io.to(user.room).emit('roomUsers', {
                //     room: user.room,
                //     users: getRoomUsers(room)
                // });
            })
            socket.broadcast.emit('message','a user has joined the chat');

            socket.on('disconnect', () => {
                io.of('/chat').emit('message', 'a user has left the chat');
            });
        
            socket.on('message', ({message, room}) => {
                io.of('/chat').to(room).emit('message', message);
                console.log(message);
                console.log(room);
            });
        })
    }
}