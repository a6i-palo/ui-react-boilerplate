import React, {FunctionComponent, useRef} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {INavbarProps} from './NavbarContainer';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

import './Navbar.scss';

export const Navbar: FunctionComponent<INavbarProps> = ({menuState, toggleMenu}) => {
    const buttonRef = useRef(null);
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleMenu} ref={buttonRef}>
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={buttonRef.current}
                    keepMounted
                    open={Boolean(buttonRef && menuState)}
                    onClose={toggleMenu}
                >
                    <MenuItem onClick={toggleMenu} component={Link} to="/">
                        Home
                    </MenuItem>
                    <MenuItem onClick={toggleMenu} component={Link} to="/gists">
                        Gists Example
                    </MenuItem>
                </Menu>
                <Typography variant="h6" styleName="title">
                    News
                </Typography>
                <Button color="inherit">Login</Button>
            </Toolbar>
        </AppBar>
    );
};

Navbar.propTypes = {
    menuState: PropTypes.bool.isRequired,
    toggleMenu: PropTypes.func.isRequired,
};
