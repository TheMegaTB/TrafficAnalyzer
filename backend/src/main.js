const express = require('express');
const path = require('path');
const app = express();

app.use('/', express.static(path.join(__dirname, '../../frontend')));

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

app.listen(8010, function () {
    console.log('Example app listening on port 8080!')
});

import {populateRoutes, tickRoutes} from "./routes";
import './websocket';

populateRoutes().then(() => {
    tickRoutes();
    setInterval(tickRoutes, 2 * 60 * 1000);
}).catch((err) => console.error(err));