import React, { Component } from 'react';
import Card, {CardContent} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import xolor from 'xolor';
import C3Chart from 'react-c3js';

import 'c3/c3.css';

import {requestRoute} from "../api/data";
import {drawGraph} from "../api/draw";


const weekdayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];


export default class Graph extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            "route": {},
            "minimum": 0,
            "maximum": 0
        }
    }

    componentDidMount() {
        const graph = this;
        requestRoute(this.props.match.params.route, this.props.match.params.direction).then((route) => {
            // drawGraph(route, this.graphElement);

            const maximum = route.datapoints.reduce((a, b) => Math.max(a ? a : 0, b[2]));
            const minimum = route.datapoints.reduce((a, b) => Math.min(a ? a : Infinity, b[2]));
            console.log(minimum, maximum);
            graph.setState({
                route,
                minimum,
                maximum
            });
        });
    }

    componentDidUpdate() {
        console.log("update");
        const now = new Date();
        const hoursSinceMidnight = (now.getSeconds() + (60 * now.getMinutes()) + (60 * 60 * now.getHours())) / 60 / 60;

        console.log("HSM", hoursSinceMidnight);

        if (this.chart && this.chart.chart) {
            this.chart.chart.focus(weekdayNames[new Date().getDay() - 1]);
            this.chart.chart.xgrids.add(
                {value: hoursSinceMidnight, text: 'Current time'}
            );
            this.chart.chart.zoom.enable(true);
            this.chart.chart.axis.labels({
                x: 'Time of day',
                y: 'Travel duration'
            });
            this.chart.chart.internal.config.axis_x_tick_count = 12;
            this.chart.chart.internal.config.axis_x_tick_format = Math.round;
            this.chart.chart.internal.xAxisTickValues = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
            ];
            this.chart.chart.flush();

            console.log(this.chart.chart.internal);
        }
    }

    render() {
        console.log(this.state);
        let currentTravelTime = "N/A";
        let currentTravelTimeColor = "#000000";

        const c3data = {
            xs: {},
            columns: [],
            type: "spline"
        };

        if (this.state.route.datapoints) {
            currentTravelTime = Math.round(this.state.route.datapoints[this.state.route.datapoints.length - 1][2]);

            const percentage = (currentTravelTime - this.state.minimum) / (this.state.maximum - this.state.minimum);

            currentTravelTimeColor = xolor('#00FF00').gradient('#FF0000', percentage).hex;
            console.log(currentTravelTime, currentTravelTimeColor);

            // Sort data by weekday
            const weekdays = [];

            this.state.route.datapoints.forEach((point) => {
                if (!weekdays[point[0]]) weekdays[point[0]] = [point];
                else weekdays[point[0]].push(point);
            });

            // Go through each weekday, sort the datapoints and add them to the list
            weekdays.forEach((weekday, i) => {
                const weekdayName = weekdayNames[i - 1];

                weekday.sort((a, b) => {
                    return a[1] - b[1];
                });

                c3data.xs[weekdayName] = "x-" + weekdayName;

                const columnX = ["x-" + weekdayName];
                const columnY = [weekdayName];

                weekday.forEach((datapoint) => {
                    columnX.push(datapoint[1]);
                    columnY.push(datapoint[2]);
                });

                c3data.columns.push(columnX);
                c3data.columns.push(columnY);
            });
        }

        return (
            <div style={{width: '100%', height: '100%'}}>
                <Card>
                    <CardContent>
                        <Typography type="body1" align="center">
                            Current time to destination
                        </Typography>
                        <Typography type="headline" align="center" style={{color: currentTravelTimeColor}}>
                            {currentTravelTime}{currentTravelTime > 1 ? "mins" : "min"}
                        </Typography>
                    </CardContent>
                </Card>
                {this.state.route.datapoints ?
                    <C3Chart
                        style={{height: '80%'}}
                        data={c3data}
                        ref={(chart) => { this.chart = chart; }}
                    />
                    : "loading"}
            </div>
        );
    }
}
