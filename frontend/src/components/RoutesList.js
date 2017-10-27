import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText, ListSubheader } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import {LinkContainer} from 'react-router-bootstrap';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        minWidth: 200,
        background: theme.palette.background.paper,
    },
});

class RoutesList extends React.Component {
    render() {
        const {classes} = this.props;

        // TODO Make this dynamic and fetch data from the backend

        return (
            <div className={classes.root}>
                <List>
                    <ListSubheader>Commute</ListSubheader>
                    <LinkContainer to="/route/Commute/0">
                        <ListItem button>
                            <ListItemText primary="To Home"/>
                        </ListItem>
                    </LinkContainer>
                    <LinkContainer to="/route/Commute/1">
                        <ListItem button>
                            <ListItemText primary="To Work"/>
                        </ListItem>
                    </LinkContainer>
                </List>
                <Divider/>
                <List>
                    <ListSubheader>Commute</ListSubheader>
                    <LinkContainer to="/route/Lars/0">
                        <ListItem button>
                            <ListItemText primary="To NewHome"/>
                        </ListItem>
                    </LinkContainer>
                    <LinkContainer to="/route/Lars/1">
                        <ListItem button>
                            <ListItemText primary="To Work"/>
                        </ListItem>
                    </LinkContainer>
                </List>
                <Divider/>
                <List>
                    <LinkContainer to="/">
                        <ListItem button>
                            <ListItemText primary="Home"/>
                        </ListItem>
                    </LinkContainer>
                </List>
            </div>
        );
    }
}

RoutesList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RoutesList);
