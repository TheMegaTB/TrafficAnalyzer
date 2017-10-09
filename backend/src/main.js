import {populateRoutes, tickRoutes} from "./routes";
import './websocket';

async function writeTimes() {
    // const now = new Date();
    // const timestamp = ("0" + now.getHours()).slice(-2)   + ":" +
    //                     ("0" + now.getMinutes()).slice(-2) + ":" +
    //                     ("0" + now.getSeconds()).slice(-2);
    // console.log("\t" + Math.round(toWork.duration) + " mins\t\t" + Math.round(toHome.duration) + " mins\t\t" + timestamp);
}

populateRoutes().then(() => {
    tickRoutes();
    setInterval(tickRoutes, 2 * 60 * 1000);
}).catch((err) => console.error(err));

// TODO Dump data into this tool (grid view works best):
// http://almende.github.io/chap-links-library/js/graph3d/playground/