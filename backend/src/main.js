import {populateRoutes, tickRoutes} from "./routes";
import './websocket';

populateRoutes().then(() => {
    tickRoutes();
    setInterval(tickRoutes, 2 * 60 * 1000);
}).catch((err) => console.error(err));