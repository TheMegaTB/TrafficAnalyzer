import {readFromCSV, writeToCSV} from "./csv";
import {getTravelObject} from "./data-fetching";

const config = require("../config.json");

const routes = {
    // "someRoute": [
    //     {"from": ..., "to": ..., "datapoints": []}
    //     {"from": ..., "to": ..., "datapoints": []}
    // ]
};

export function getRoute(routeName, directionIndex) {
    if (!routes.hasOwnProperty(routeName)) return {};
    const route = routes[routeName];
    if (directionIndex >= route.length) return {};
    return route[directionIndex];
}

export function getRouteMap() {
    const routeMap = {};

    for (let route in routes) {
        if (!routes.hasOwnProperty(route)) continue;
        routeMap[route] = routes[route].map((direction) => {
            return {
                "from": direction.from,
                "to": direction.to
            };
        });
    }

    return routeMap;
}

async function populateRoute(routeName, origin, destination) {
    console.log(`Route '${routeName}' from ${origin.name} -> ${destination.name}`);

    // Load the datapoints
    let datapoints = [];
    try {
        datapoints = await readFromCSV(`routes/${routeName}/${origin.name}-${destination.name}.csv`);
    } catch (error) { console.error(error); }

    if (!routes.hasOwnProperty(routeName)) routes[routeName] = [];
    routes[routeName].push({
        "from": origin,
        "to": destination,
        "datapoints": datapoints
    });
}

export async function populateRoutes() {
    const configRouteNames = Object.keys(config.routes);
    await Promise.all(configRouteNames.map(async (routeName) => {
        const route = config.routes[routeName];

        await Promise.all(route.map(async (origin) => {
            await Promise.all(route.map(async (destination) => {
                if (origin === destination) return;
                await populateRoute(routeName, origin, destination);
            }));
        }));
    }));
}

export function tickRoutes() {
    for (let routeName in routes) {
        if (!routes.hasOwnProperty(routeName)) continue;
        const directions = routes[routeName];
        directions.map(async (route) => {
            try {
                const datapoint = await getTravelObject(route.from.location, route.to.location);

                console.log("Got new datapoint: ", datapoint);
                // Push the new datapoint into memory
                route.datapoints.push(Object.values(datapoint));
                // And store it on the disk (inside the CSV)
                writeToCSV(`routes/${routeName}/${route.from.name}-${route.to.name}.csv`, datapoint);
            } catch (error) {
                console.error("Failed to retrieve datapoint", error);
            }
        });
    }
}