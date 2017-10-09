import {drawGraph} from "./draw";

const ReconnectingWebSocket = require('reconnecting-websocket');
const rws = new ReconnectingWebSocket('ws://' + window.location.hostname + ':1337');

rws.addEventListener('open', () => {
    rws.send(JSON.stringify({
        "type": "routeRequest",
        "routeName": "workRoute",
        "directionIndex": 1
    }));
});

rws.addEventListener('message', (msg) => {
    const data = JSON.parse(msg.data);
    console.log("ws-msg:", data);
    drawGraph(data);
});
