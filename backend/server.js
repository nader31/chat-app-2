const app = require("./app");
// const debug = require("debug")("node-angular");
const http = require("http");
const cors = require('cors');

const port = 3000;

app.set("port", port);

const server = http.createServer(app);
const sockets = require("./routes/socket");

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

sockets.connect(io, port);

app.get('/', (req, res) => {
    res.send('Hello world');
})

server.listen(port, () => {
    console.log('Server is running on port ' + port);
})