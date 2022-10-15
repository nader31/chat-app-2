// var assert = require('assert');
//setup for sockets
// var io = require('socket.io-client');
// var socketURL = 'http://localhost:3000/chat';
// var options = {
//     transports: ['websocket'],
//     'force new connection':true
// }

const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const assert = require("chai").assert;

var Users = [{'name':'Tom'},{'name':'Sally'},{'name':'Marc'}];

describe('Array', function() {
    describe('Does User exists', function() {
        it('should return true if the value of Tom is present', function() {
            assert.equal(Users[0].name,"Tom");
        });
    });
});

//Socket Tests
// describe('chat server', () => {
//     it ('Should broadcast a message to all users', function(done) {
//         var client1 = io.connect(socketURL,options);
//         client1.on('connection', () => {
//             client1.emit('message', 'Client one message');
    
//             var client2 = io.connect(socketURL,options);
//             client2.on('connection', function(data) {
//                 client2.emit('message', 'Client two message');
//             });
    
//             client1.on('message', (data) => {
//                 assert.equal(data, "Client one message")
//                 client1.disconnect();
//             });
    
//             client2.on('message', (data) => {
//                 assert.equal(data, "Client two message");
//                 client2.disconnect();
//                 done();
//             });
//         })
//     })
// })

describe("my awesome project", () => {
    let io, serverSocket, clientSocket;
  
    before((done) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      httpServer.listen(() => {
        const port = httpServer.address().port;
        clientSocket = new Client(`http://localhost:${port}`);
        io.on("connection", (socket) => {
          serverSocket = socket;
        });
        clientSocket.on("connect", done);
      });
    });
  
    after(() => {
      io.close();
      clientSocket.close();
    });
  
    it("should work", (done) => {
      clientSocket.on("hello", (arg) => {
        assert.equal(arg, "world");
        done();
      });
      serverSocket.emit("hello", "world");
    });
  
    it("should work (with ack)", (done) => {
      serverSocket.on("hi", (cb) => {
        cb("hola");
      });
      clientSocket.emit("hi", (arg) => {
        assert.equal(arg, "hola");
        done();
      });
    });
  });