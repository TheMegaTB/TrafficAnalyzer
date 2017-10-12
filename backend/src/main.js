import {setupWebsocket} from "./websocket";
import {populateRoutes, tickRoutes} from "./routes";

const express = require('express');
const path = require('path');
const http = require('http');
const app = express();

app.use('/', express.static(path.join(__dirname, '../../frontend')));

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// app.listen(8010, function () {
//     console.log('Example app listening on port 8080!')
// });

const server = http.createServer(app);

setupWebsocket(server);

server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});


populateRoutes().then(() => {
    tickRoutes();
    setInterval(tickRoutes, 2 * 60 * 1000);
}).catch((err) => console.error(err));