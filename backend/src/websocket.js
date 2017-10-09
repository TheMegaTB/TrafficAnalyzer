import {getRoute, getRouteMap} from "./routes";

const config = require("../config.json");
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: config.websocket.port });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        const data = JSON.parse(message);

        let res = {};

        if (data.type === "routeRequest") {
            res = getRoute(data.routeName, data.directionIndex);
        } else if (data.type === "routeListRequest") {
            res = getRouteMap();
        }

        if (res) {
            ws.send(JSON.stringify({
                token: data.token,
                data: res
            }));
        }
    });
});