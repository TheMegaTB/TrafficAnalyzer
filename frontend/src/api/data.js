const ReconnectingWebSocket = require('reconnecting-websocket');
export const rws = new ReconnectingWebSocket('ws://' + window.location.host + "/api");

const callbacks = {};
const pendingMessages = [];

rws.addEventListener('message', (msg) => {
    const data = JSON.parse(msg.data);
    if (callbacks.hasOwnProperty(data.token)) {
        const [resolve, timeoutID] = callbacks[data.token];
        clearTimeout(timeoutID);
        resolve(data.data);
    }
});

rws.addEventListener('open', () => pendingMessages.forEach(rws.send));

rws.sendObject = (obj) => {
    obj.token = Math.random().toString(36).substr(2);
    const msg = JSON.stringify(obj);
    if (rws.readyState === 1)
        rws.send(msg);
    else
        pendingMessages.push(msg);
    return obj.token;
};

rws.callFunction = (obj) => {
    return new Promise((resolve, reject) => {
        const token = rws.sendObject(obj);
        callbacks[token] = [
            resolve,
            setTimeout(() => {
                reject("RPC timeout.");
                delete callbacks[token];
            }, 5000)
        ];
    });
};

export function requestRoute(route, direction) {
    return rws.callFunction({
        "type": "routeRequest",
        "routeName": route,
        "directionIndex": direction
    });
}

// rws.addEventListener('open', async () => {
//     const test = await requestRoute("Commute", 0);
//     console.log("Received value!", test);
// });
