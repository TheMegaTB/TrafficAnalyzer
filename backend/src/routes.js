import {readFromCSV, writeToCSV} from "./csv";
import {getTravelObject} from "./data-fetching";
import {Graph} from "./graph";

const config = require("../routes/config.json");

const routes = {
    // "someRoute": [
    //     {"from": ..., "to": ..., "datapoints": {
    //          "2017": { /* year */
    //              "41": [Graph*7] /* week */
    //          }
    //     }}
    //     {"from": ..., "to": ..., "datapoints": []}
    // ]
};

export function getRoute(routeName, directionIndex) {
    if (!routes.hasOwnProperty(routeName)) return {};
    const route = routes[routeName];
    if (directionIndex >= route.length) return {};

    const direction = route[directionIndex];

    const datapoints = direction.datapoints;

    const averagedDatapoints = [];

    for (let weekday = 0; weekday < 7; weekday++) {
        for (let hour = 0; hour < 24; hour+=0.0333) {
            const values = [];
            Object.keys(datapoints).map((year) => {
                Object.keys(datapoints[year]).map((week) => {
                    const graph = datapoints[year][week][weekday];
                    if (!graph) return;
                    const elongation = graph.elongation(hour);
                    if (elongation)
                        values.push(elongation);
                });
            });
            if (values.length) {
                const average = values.reduce((a, b) => a + b, 0) / values.length;
                averagedDatapoints.push([weekday, hour, average]);
            }
        }
    }

    return {
        "from": direction.from,
        "to": direction.to,
        "currentTravelDuration": direction.currentTravelDuration,
        "datapoints": averagedDatapoints
    };
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

function addDatapointToGraph(routeName, direction, year, week, weekday, hours, duration) {
    const r = routes[routeName][direction].datapoints;
    if (!r[year]) r[year] = {};
    if (!r[year][week]) r[year][week] = [];
    if (!r[year][week][weekday]) r[year][week][weekday] = new Graph([]);
    r[year][week][weekday].addDatapoint(hours, duration);
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
        "currentTravelDuration": Infinity,
        "datapoints": {}
    });

    datapoints.forEach((datapoint) =>
        addDatapointToGraph(routeName, routes[routeName].length - 1, datapoint[4], datapoint[3], datapoint[0], datapoint[1], datapoint[2])
    );
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
        directions.map(async (route, direction) => {
            try {
                const datapoint = await getTravelObject(route.from.location, route.to.location);

                console.log("Got new datapoint: ", datapoint);

                // And store it on the disk (inside the CSV)
                writeToCSV(`routes/${routeName}/${route.from.name}-${route.to.name}.csv`, datapoint);

                // Push the new datapoint into memory
                route.currentTravelDuration = datapoint.duration;
                addDatapointToGraph(routeName, direction, datapoint.year, datapoint.week, datapoint.weekday, datapoint.hours, datapoint.duration);
            } catch (error) {
                console.error("Failed to retrieve datapoint", error);
            }
        });
    }
}