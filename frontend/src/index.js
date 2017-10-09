import React from 'react';
import {render} from 'react-dom';

import 'typeface-roboto';
import './styles/main.css';

import './api/data';
import './api/draw';
import Navigation from './components/Navigation';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'
import Graph from "./components/Graph";

const Child = ({ match }) => (
    <div>
        <h3>Route: {match.params.route}</h3>
        <h3>Direction: {match.params.direction}</h3>
    </div>
);

class App extends React.Component {
    render () {
        return (
            <Router>
                <div style={{width: '100%', height: '100%'}}>
                    <Navigation/>

                    <Route path="/route/:route/:direction" component={Graph}/>
                </div>
            </Router>
        );
    }
}

render(<App/>, document.getElementById('app'));
