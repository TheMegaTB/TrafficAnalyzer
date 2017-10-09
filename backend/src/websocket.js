import {getRoute} from "./routes";

const config = require("../config.json");
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: config.websocket.port });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        const data = JSON.parse(message);
        if (data.type === "routeRequest") {
            ws.send(JSON.stringify(getRoute(data.routeName, data.directionIndex)));
        }
    });
});