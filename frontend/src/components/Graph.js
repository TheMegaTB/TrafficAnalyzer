import React, { Component } from 'react';
import Card, {CardContent} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Grid from "material-ui/Grid";
import xolor from 'xolor';
import C3Chart from 'react-c3js';

import 'c3/c3.css';

import {requestRoute} from "../api/data";

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

        this.updateGraphData = this.updateGraphData.bind(this);
    }

    updateGraphData() {
        console.log("UPDATE");

        const graph = this;
        requestRoute(this.props.match.params.route, this.props.match.params.direction).then((route) => {
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

    componentDidMount() {
        this.updateGraphData();
        this.updateInterval = setInterval(this.updateGraphData, 2*60*1000);
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    componentDidUpdate(prevProps) {
        const graph = this;

        // Update the graph if the path changed
        const newParams = this.props.match.params;
        const oldParams = prevProps.match.params;
        if (newParams.route !== oldParams.route || (newParams.route === oldParams.route && newParams.direction !== oldParams.direction))
            this.updateGraphData();

        // Make the graph nice
        const now = new Date();
        const hoursSinceMidnight = (now.getSeconds() + (60 * now.getMinutes()) + (60 * 60 * now.getHours())) / 60 / 60;

        if (this.chart && this.chart.chart && this.state.route.datapoints) {
            // Calculate the amount of hours the graph covers
            const maximumTime = this.state.route.datapoints.reduce((a, b) => Math.max(a ? a : 0, b[1]));
            const minimumTime = this.state.route.datapoints.reduce((a, b) => Math.min(a ? a : Infinity, b[1]));
            const graphXdelta = Math.round(maximumTime - minimumTime);

            this.chart.chart.focus(weekdayNames[new Date().getDay() - 1]);
            this.chart.chart.xgrids([
                {value: hoursSinceMidnight, text: 'Current time'}
            ]);
            this.chart.chart.zoom.enable(true);
            this.chart.chart.axis.labels({
                x: 'Time of day',
                y: 'Travel duration'
            });
            this.chart.chart.internal.config.axis_x_tick_values = new Array(graphXdelta).fill(0).map((e,i) => i + Math.round(minimumTime));
            console.log(this.chart.chart.internal);
            this.chart.chart.internal.config.zoom_onzoom = (level) => {
                graph.zoomLevel = level;
            };
            this.chart.chart.flush();
            this.chart.chart.zoom(this.zoomLevel); // TODO This causes some weird jumping. Fix that.
        }
    }

    render() {
        let currentTravelTime = "N/A";
        let currentTravelTimeColor = "#000000";

        let routeString = "N/A";

        const c3data = {
            xs: { "EMA": "x-EMA" },
            columns: [],
            colors: { "EMA": "#B0BEC5" },
            hide: ['EMA'],
            type: "spline",
            types: { "EMA": "area-spline" }
        };

        if (this.state.route.datapoints) {
            currentTravelTime = Math.round(this.state.route.datapoints[this.state.route.datapoints.length - 1][2]);

            const percentage = (currentTravelTime - this.state.minimum) / (this.state.maximum - this.state.minimum);

            currentTravelTimeColor = xolor('#5a9d00').gradient('#FF3D00', percentage).hex;

            // Sort data by weekday
            const weekdays = [];

            this.state.route.datapoints.forEach((point) => {
                if (!weekdays[point[0]]) weekdays[point[0]] = [point];
                else weekdays[point[0]].push(point);
            });

            // Go through each weekday, sort the datapoints and add them to the list
            weekdays.forEach((weekday, i) => {
                const weekdayName = weekdayNames[i - 1];

                weekday.sort((a, b) => a[1] - b[1]);

                const columnX = ["x-" + weekdayName];
                const columnY = [weekdayName];

                weekday.forEach((datapoint) => {
                    columnX.push(datapoint[1]);
                    columnY.push(datapoint[2]);
                });

                c3data.columns.push(columnX);
                c3data.columns.push(columnY);
                c3data.xs[weekdayName] = "x-" + weekdayName;
            });

            // Calculate an EMA graph
            this.state.route.datapoints.sort((a, b) => a[1] - b[1]);
            const emaColumnX = ["x-EMA"];
            const emaColumnY = ["EMA"];
            const emaArray = [this.state.route.datapoints[0][2]];

            const mRange = 50;
            const k = 2/(mRange + 1);
            this.state.route.datapoints.forEach((datapoint, i) => {
                if (i < 1) return;
                emaColumnX.push(datapoint[1]);
                const emaValue = datapoint[2] * k + emaArray[i - 1] * ( 1 - k );
                emaColumnY.push(emaValue);
                emaArray.push(emaValue);
            });

            c3data.columns.push(emaColumnX);
            c3data.columns.push(emaColumnY);

            routeString = `${this.state.route.from.name} -> ${this.state.route.to.name}`;
        }

        return (
            <div style={{width: '100%', height: '100%'}}>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography type="body1" align="center">
                                    Current route
                                </Typography>
                                <Typography type="headline" align="center">
                                    {routeString}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                </Grid>
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
