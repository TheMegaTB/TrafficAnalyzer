import {getRoute, getRouteMap} from "./routes";

const config = require("../routes/config.json");
const WebSocket = require('ws');

export function setupWebsocket(server) {
    const wss = new WebSocket.Server({ server });
    wss.on('connection', function connection(ws, req) {
        console.log(req.url);

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
}