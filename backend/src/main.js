import {setupWebsocket} from "./websocket";
import {populateRoutes, tickRoutes} from "./routes";

const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const config = require('../routes/config');

app.use('/', express.static(path.join(__dirname, '../../frontend')));

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

const server = http.createServer(app);

setupWebsocket(server);

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});

console.log("Refresh interval: ", config.interval);

populateRoutes().then(() => {
    tickRoutes();
    setInterval(tickRoutes, config.interval);
}).catch((err) => console.error(err));