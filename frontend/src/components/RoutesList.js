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

        return (
            <div className={classes.root}>
                <List>
                    <ListSubheader>Work route</ListSubheader>
                    <LinkContainer to="/route/Commute/0">
                        <ListItem button>
                            <ListItemText primary="Test"/>
                        </ListItem>
                    </LinkContainer>
                    <ListItem button>
                        <ListItemText primary="Work -> Home"/>
                    </ListItem>
                </List>
                <Divider/>
                <List>
                    <ListItem button>
                        <ListItemText primary="Trash"/>
                    </ListItem>
                    <ListItem button component="a" href="#simple-list">
                        <ListItemText primary="Spam"/>
                    </ListItem>
                </List>
            </div>
        );
    }
}

RoutesList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RoutesList);
