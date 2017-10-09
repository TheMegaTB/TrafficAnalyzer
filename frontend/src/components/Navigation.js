import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import RoutesList from "./RoutesList";

const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

class Navigation extends React.Component {
    constructor(props) {
        super(props);

        this.state = {"open": false};

        this.toggleDrawer = () => {
            this.setState({ "open": !this.state.open });
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="contrast" aria-label="Menu" onClick={this.toggleDrawer}>
                            <MenuIcon />
                        </IconButton>
                        <Typography type="title" color="inherit" className={classes.flex}>
                            TrafficAnalyzer
                        </Typography>
                        <Button color="contrast">Login</Button>
                    </Toolbar>
                </AppBar>
                <Drawer open={this.state.open} onRequestClose={this.toggleDrawer}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer}
                        onKeyDown={this.toggleDrawer}
                    >
                        <RoutesList/>
                    </div>
                </Drawer>
            </div>
        )
    }
}

Navigation.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Navigation);
