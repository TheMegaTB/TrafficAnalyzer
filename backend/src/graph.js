const getClosest = require("get-closest");

export class Graph {
    constructor(datapoints, xIndex = 0, yIndex = 1) {
        const graph = this;
        graph.x = [];
        graph.y = [];
        datapoints.forEach((datapoint) => {
            graph.x.push(datapoint[xIndex]); // push weekday as X
            graph.y.push(datapoint[yIndex]); // push travel time as Y
        });
    }

    addDatapoint(x, y) {
        const insertionIndex = getClosest.lowerNumber(x, this.x) + 1;

        const xExists = this.x[insertionIndex - 1] === x;
        const yExists = this.y[insertionIndex - 1] === y;

        if (xExists && !yExists) {
            console.error("Attempted to insert two distinct y-values for the same x-coordinate");
        } else {
            this.x.splice(insertionIndex, 0, x);
            this.y.splice(insertionIndex, 0, y);
        }
    }

    elongation(x) {
        const greaterIndex = getClosest.greaterNumber(x, this.x);
        const lowerIndex = getClosest.lowerNumber(x, this.x);
        const greater = this.x[greaterIndex];
        const lower = this.x[lowerIndex];
        const deltaX = greater - lower;
        const deltaY = this.y[greaterIndex] - this.y[lowerIndex];

        if (deltaX === 0) return this.y[greater];
        else if (deltaX > 0.16) return NaN; // If we don't have points close then just say we don't have the elongation available

        const gradient = deltaY / deltaX;
        const xDistance = x - lower;
        return this.y[lowerIndex] + (xDistance * gradient);
    }

    inspect(depth, opts) {
        return 'Graph { x: ' + this.x.length + ' points, y: ' + this.y.length + ' points }';
    }
}