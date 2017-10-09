import { DataSet } from 'vis/index-graph3d';
import { Graph3d } from 'vis/index-graph3d';
import 'vis/dist/vis-network.min.css';

const graphOptions = {
    width:  '100%',
    height: '100%',
    style: 'grid',
    showPerspective: true,
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
const container = document.getElementById('mygraph');
let graph;

export function drawGraph(route) {
    // Create and populate a data table.
    const data = new DataSet();

    route.datapoints.forEach((datapoint) => {
        data.add({
            x: datapoint[0], // weekday
            y: datapoint[1], // hour of day
            z: datapoint[2], // duration
            style: datapoint[2]
        });
    });

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
