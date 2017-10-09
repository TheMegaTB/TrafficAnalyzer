import { DataSet } from 'vis/index-graph3d';
import { Graph3d } from 'vis/index-graph3d';
import 'vis/dist/vis-network.min.css';

const graphOptions = {
    width:  '100%',
    height: '100%',
    style: 'grid',
    showPerspective: false,
    showGrid: true,
    showShadow: true,
    keepAspectRatio: true,
    verticalRatio: 0.5,
    cameraPosition: {
        horizontal: Math.PI * 1.5,
        vertical: 0,
        distance: 1.7
    }
};

let graph;

export function drawGraph(route, container) {
    // Create and populate a data table.
    const data = new DataSet();

    // const weekdays = [];
    //
    // route.datapoints.forEach((point) => {
    //     if (!weekdays[point[0]]) weekdays[point[0]] = [point];
    //     else weekdays[point[0]].push(point);
    // });
    //
    // console.log(weekdays);
    // weekdays.forEach((day) => {
    //     const lastEntry = day[day.length - 1].slice();
    //     lastEntry[2] = 0;
    //     day.push(lastEntry);
    //
    //     const firstEntry = day[0].slice();
    //     firstEntry[2] = 0;
    //     day.unshift(firstEntry);
    // });

    // weekdays.forEach((weekday) => {
    //     weekday.forEach((datapoint) => {
    //         data.add({
    //             x: datapoint[0], // weekday
    //             y: datapoint[1], // hour of day
    //             z: datapoint[2], // duration
    //             style: datapoint[2]
    //         });
    //     });
    // });
    for (let x = 1; x < 6; x++) {
        for (let y = 7; y < 20; y+=0.1) {
            console.log(x, y);
            data.add({
                x,
                y,
                z: Math.sin(y + Math.random())
            });
        }
    }
    // route.datapoints.forEach((datapoint) => {
    //     data.add({
    //         x: datapoint[0], // weekday
    //         y: datapoint[1], // hour of day
    //         z: datapoint[2], // duration
    //         style: datapoint[2]
    //     });
    // });

    if (!graph) {
        graph = new Graph3d(container, data, graphOptions);
        graph.setCameraPosition(200, 20, 2);
        graph.redraw();
    } else
        graph.setData(data);
}

window.onresize = () => {
    if (graph) graph.redraw();
};
