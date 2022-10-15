var assert = require('assert');

//setup for sockets
// var io = require('socket.io-client');
// var SocketURL = 'http://localhost:3000';
// var options = {
//     transports: ['websocket'],
//     'force new connection':true
// };

var Users = [{'name':'Tom'},{'name':'Sally'},{'name':'Marc'}];

describe('Array', function() {
    describe('Does User exists', function() {
        it('should return true if the value of Tom is present', function() {
            assert.equal(Users[0].name,"Tom");
        });
    });
});