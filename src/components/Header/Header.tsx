import React, { useContext } from "react";
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
import { UserContext } from "../../App";

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
      [theme.breakpoints.down("sm")]:{
        width: '12rem',
      },
      [theme.breakpoints.up("md")]:{
        width: '15rem',
      },
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
  const userContext = useContext(UserContext);

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
      {(userContext.currentUser.role === 'ADMIN' || userContext.currentUser.role === 'FTE') &&
      <MenuItem onClick={handleMenuClose}>
        <NavLink exact to='/viewApprentices' className={classes.mobileLink} activeClassName={classes.activeLink}>View Apprentices</NavLink>
      </MenuItem>
      }
      <MenuItem onClick={handleMenuClose}>
        <NavLink exact to='/rate' className={classes.mobileLink} activeClassName={classes.activeLink}>Rate</NavLink>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.header}>
        <Toolbar>
          <NavLink exact to='/'>
          <img src={logo} title='EduSource' alt='EduSource' className={classes.logo} />
          </NavLink>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {(userContext.currentUser.role === 'ADMIN' || userContext.currentUser.role === 'FTE') &&
            <Typography><NavLink exact to='/viewApprentices' className={classes.link} activeClassName={classes.activeLink}>View Apprentices</NavLink></Typography>
            }
            <Typography><NavLink exact to='/rate' className={classes.link} activeClassName={classes.activeLink}>Rate</NavLink></Typography>
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
