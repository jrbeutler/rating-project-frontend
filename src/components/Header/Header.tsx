import React from "react";
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/EduSource Logo_RGB_clr.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    logo: {
      width: '15rem',
      marginBottom: '0.5rem',
    },
    link: {
      marginRight: '1rem',
      fontSize: '1.25rem',
      color: '#FFFFFF',
      textDecoration: 'none',
      borderBottom: '#FFFFFF 1.5px solid',
    },
    mobileLink: {
      marginRight: '1rem',
      fontSize: '1.25rem',
      color: '#000000',
    },
    activeLink: {
      marginRight: '1rem',
      fontSize: '1.25rem',
      color: '#F7931E',
      textDecoration: 'none',
      borderBottom: '#F7931E 1.5px solid',
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  }),
);

const Header: React.FC = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <NavLink exact to='/addUser' className={classes.mobileLink} activeClassName={classes.activeLink}>Rate</NavLink>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <NavLink exact to='/rate' className={classes.mobileLink} activeClassName={classes.activeLink}>Rate</NavLink>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <NavLink exact to='/' className={classes.mobileLink} activeClassName={classes.activeLink}>Profile</NavLink>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.header}>
        <Toolbar>
          <img src={logo} title='EduSource' alt='EduSource' className={classes.logo} />
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Typography><NavLink exact to='/addUser' className={classes.link} activeClassName={classes.activeLink}>Add User</NavLink></Typography>
            <Typography><NavLink exact to='/rate' className={classes.link} activeClassName={classes.activeLink}>Rate</NavLink></Typography>
            <Typography><NavLink exact to='/' className={classes.link} activeClassName={classes.activeLink}>Profile</NavLink></Typography>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}

export default Header;
