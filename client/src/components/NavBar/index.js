import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, Navigate, useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, Collapse, Link, Tooltip, useMediaQuery } from '@mui/material';

import {
  getActiveEventsNumber,
  getMyCommunicationUnreadNumber
} from '../../api/index';
import { appConfig } from '../../config';
import { MenuSidebar } from '../../menu-sidebar';
import { useAuth } from '../AuthProvider';
import NavSearch from './NavSearch';
import {
  is_TaiGer_Agent,
  is_TaiGer_Editor,
  is_TaiGer_Student,
  is_TaiGer_role
} from '../../Demo/Utils/checking-functions';
import ChatList from '../ChatList';
import { stringAvatar } from '../../Demo/Utils/contants';
import Footer from '../Footer/Footer';
import Loading from '../Loading/Loading';
import DEMO from '../../store/constant';

const drawerWidth = 300;
const ExcludeMenu = {
  Guest: [
    'Component',
    'Docs Database',
    'Tools',
    'My Students',
    'All Students',
    'Documentation',
    'Menu Levels',
    `${appConfig.companyName} Teams`,
    `${appConfig.companyName} Members`,
    'Tasks Overview',
    'Uni-Assist Tasks',
    'Base Documents',
    'My Tasks Overview',
    'Applications Overview',
    'CV/ML/RL Center',
    'Statistics',
    'Charts',
    'Applications Overview',
    'Program List',
    'Interview Training',
    `${appConfig.companyName} Admissions`,
    'Map',
    'Internal Docs',
    'Archiv Students',
    'Internal Docs',
    'Documentation',
    'Student Database',
    'Tasks Dashboard',
    `${appConfig.companyName} Members`,
    'User Logs',
    'User List'
  ],
  Student: [
    'Component',
    'Docs Database',
    'Tools',
    'My Students',
    'All Students',
    'Menu Levels',
    `${appConfig.companyName} Teams`,
    `${appConfig.companyName} Members`,
    'Tasks Overview',
    'Charts',
    'Statistics',
    'My Tasks Overview',
    'Program List',
    'Map',
    'Applications Overview',
    'CV/ML/RL Center',
    'Base Documents',
    'Interview Training',
    `${appConfig.companyName} Admissions`,
    'Internal Docs',
    'Archiv Students',
    'Student Database',
    'Tasks Dashboard',
    `${appConfig.companyName} Members`,
    'User Logs',
    'User List'
  ],
  Agent: [
    'Component',
    'Applications Overview',
    'Tools',
    'Menu Levels',
    'My Courses',
    'My Survey',
    'Tasks Overview',
    'Portals Management',
    'Applications Overview',
    'Uni-Assist Tasks',
    'My Tasks Overview',
    'My Applications',
    'Statistics',
    'Charts',
    'Map',
    'User List',
    'User Logs',
    'Contact Us'
  ],
  Editor: [
    'Component',
    'Applications Overview',
    'Tools',
    'Menu Levels',
    'My Courses',
    'My Survey',
    'Tasks Overview',
    'Portals Management',
    'Applications Overview',
    'Uni-Assist Tasks',
    'My Tasks Overview',
    'My Applications',
    'Statistics',
    'Charts',
    'Map',
    'User List',
    'User Logs',
    'Contact Us'
  ],
  Admin: [
    'Component',
    'My Students',
    'Applications Overview',
    'Menu Levels',
    'My Courses',
    'My Survey',
    'Portals Management',
    'Applications Overview',
    'Uni-Assist Tasks',
    'My Tasks Overview',
    'My Applications',
    'Charts',
    'Statistics',
    'Map',
    'Tasks Overview',
    'Contact Us'
  ]
};

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open, isMobile }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open, isMobile }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  // width: `calc(100% - ${0}px)`,
  marginLeft: isMobile ? 0 : `-${drawerWidth}px`,
  ...(open && {
    width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
    // marginLeft: isMobile ? `${drawerWidth}px` : 0,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

function NavBar(props) {
  const { t } = useTranslation();
  const { user, isAuthenticated, isLoaded, logout } = useAuth();
  const theme = useTheme();
  const [menuItemOpen, setMenuItemOpen] = useState({});
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(isMobile ? false : true);
  const [navState, setNavState] = useState({
    listOpen: false,
    dropdownShow: false,
    unreadCount: 0,
    activeEventCount: 0,
    isLoaded: false
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [anchorChatListEl, setAnchorChatListEl] = useState(null);
  const isChatListOpen = Boolean(anchorChatListEl);

  const navigate = useNavigate();
  useEffect(() => {
    // Start the periodic polling after the component is mounted
    getMyCommunicationUnreadNumber()
      .then((resp) => {
        // Assuming the backend returns JSON data, update the state with the received data
        const { data } = resp;
        setNavState((prevState) => ({
          ...prevState,
          unreadCount: data.data,
          isLoaded: true
        }));
      })
      .catch((error) => {
        // Handle errors, if any
        setNavState({ error, isLoaded: true });
      });
    // }
  }, [isLoaded, user]);

  useEffect(() => {
    // Start the periodic polling after the component is mounted
    getActiveEventsNumber()
      .then((resp) => {
        // Assuming the backend returns JSON data, update the state with the received data
        const { data } = resp;
        setNavState((prevState) => ({
          ...prevState,
          activeEventCount: data.data,
          isLoaded: true
        }));
      })
      .catch((error) => {
        // Handle errors, if any
        setNavState({ error, isLoaded: true });
      });
    // }
  }, [isLoaded, user]);

  const handleNavigateCalendar = () => {
    setNavState((prevState) => ({
      ...prevState,
      activeEventCount: 0
    }));
    if (is_TaiGer_Student(user)) {
      setMobileMoreAnchorEl(null);
      navigate(DEMO.EVENT_STUDENT_STUDENTID_LINK(user._id.toString()));
    } else if (is_TaiGer_Agent(user)) {
      setMobileMoreAnchorEl(null);
      navigate(DEMO.EVENT_TAIGER_LINK(user._id.toString()));
    }
  };

  const handleOpenChat = (e) => {
    if (is_TaiGer_Student(user)) {
      setNavState((prevState) => ({
        ...prevState,
        unreadCount: 0
      }));
      navigate(DEMO.COMMUNICATIONS_LINK(user._id.toString()));
      return;
    }
    setAnchorChatListEl(e.currentTarget);
  };

  const handleCloseChat = () => {
    setAnchorChatListEl(null);
    setMobileMoreAnchorEl(null);
    setNavState({ unreadCount: 0 });
  };

  const handleDrawerOpen = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseProfile = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
    navigate(DEMO.PROFILE);
  };

  const handleCloseSettings = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
    navigate(DEMO.SETTINGS);
  };
  const handleCloseLogout = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
    logout();
  };
  const chatId = 'primary-chat-list';
  const RenderChatList = (
    <Menu
      anchorEl={anchorChatListEl}
      id={chatId}
      open={isChatListOpen}
      onClose={handleCloseChat}
      onClick={handleCloseChat}
      sx={{
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '& .MuiAvatar-root': {
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1
        },
        '& .MuiPaper-root': {
          borderRadius: '12px' // Add border-radius for a rounded appearance
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <ChatList handleCloseChat={handleCloseChat} />
    </Menu>
  );
  const menuId = 'primary-search-account-menu';
  const RenderMenu = () => (
    <Menu
      anchorEl={anchorEl}
      id="account-menu"
      open={isMenuOpen}
      onClose={handleClose}
      onClick={handleClose}
      sx={{
        // overflow: 'visible',
        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
        mt: 1.5,
        '& .MuiAvatar-root': {
          width: 32,
          height: 32,
          ml: -0.5,
          mr: 1
        },
        '&::before': {
          content: '""',
          display: 'block',
          position: 'absolute',
          top: 0,
          right: 14,
          width: 10,
          height: 10,
          bgcolor: 'background.paper',
          transform: 'translateY(-50%) rotate(45deg)',
          zIndex: 0
        }
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem
        onClick={handleCloseProfile}
        sx={{
          '&:hover': {
            backgroundColor: '#e0e0e0' // Set a different color on hover if needed
          }
        }}
      >
        <Avatar />
        {`${user.firstname} ${user.lastname}`}
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={handleCloseSettings}
        sx={{
          '&:hover': {
            backgroundColor: '#e0e0e0' // Set a different color on hover if needed
          }
        }}
      >
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        {t('Settings')}
      </MenuItem>
      <MenuItem
        onClick={handleCloseLogout}
        sx={{
          '&:hover': {
            backgroundColor: '#e0e0e0' // Set a different color on hover if needed
          }
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        {t('Log Out')}
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {(is_TaiGer_Agent(user) || is_TaiGer_Student(user)) && (
        <MenuItem onClick={handleNavigateCalendar}>
          <IconButton
            size="large"
            aria-label="show upcoming meeting event"
            color="inherit"
          >
            <Badge badgeContent={navState.activeEventCount} color="error">
              <CalendarMonthIcon />
            </Badge>
          </IconButton>
          <Typography>{t('Calendar')}</Typography>
        </MenuItem>
      )}
      {!is_TaiGer_Editor(user) && (
        <MenuItem onClick={handleOpenChat}>
          <IconButton
            size="large"
            aria-label="show unread new messages"
            aria-controls={menuId}
            aria-haspopup="true"
            color="inherit"
          >
            <Badge badgeContent={navState.unreadCount} color="error">
              <MailIcon />
            </Badge>
          </IconButton>
          <Typography>{t('Messages')}</Typography>
        </MenuItem>
      )}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Typography>{t('Profile')}</Typography>
      </MenuItem>
    </Menu>
  );
  if (!isLoaded) {
    return <Loading />;
  }
  if (!user || !isAuthenticated) {
    if (window.location.pathname.split('?')[0] === DEMO.LOGIN_LINK) {
      return <Navigate to={`${DEMO.LOGIN_LINK}`} />;
    } else {
      return (
        <Navigate
          to={`${DEMO.LOGIN_LINK}?p=${window.location.pathname.split('?')[0]}`}
        />
      );
    }
    // navigate(DEMO.LOGIN_LINK);
  }
  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex'
        }}
        onClick={() => {
          if (isMobile) {
            handleDrawerClose();
          }
        }}
      >
        <CssBaseline />
        <AppBar position="fixed" open={open} isMobile={isMobile}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={(e) => handleDrawerOpen(e)}
              edge="start"
              sx={{ mr: 2, ...(!isMobile && open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              <Link
                underline="none"
                color="inherit"
                component={LinkDom}
                to={`${DEMO.DASHBOARD_LINK}`}
              >
                {appConfig.companyName}
              </Link>
            </Typography>
            {is_TaiGer_role(user) && <NavSearch />}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {(is_TaiGer_Agent(user) || is_TaiGer_Student(user)) && (
                <IconButton
                  size="large"
                  aria-label="show active event"
                  onClick={handleNavigateCalendar}
                  color="inherit"
                >
                  <Badge badgeContent={navState.activeEventCount} color="error">
                    <CalendarMonthIcon />
                  </Badge>
                </IconButton>
              )}
              {!is_TaiGer_Editor(user) && (
                <IconButton
                  size="large"
                  aria-label="show unread new messages"
                  aria-controls={chatId}
                  aria-haspopup="true"
                  onClick={handleOpenChat}
                  color="inherit"
                >
                  <Badge badgeContent={navState.unreadCount} color="error">
                    <MailIcon />
                  </Badge>
                </IconButton>
              )}

              <Tooltip title="Account settings">
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="account of current user"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <Avatar
                    {...stringAvatar(`${user?.firstname} ${user?.lastname}`)}
                    size="small"
                    title={`${user?.firstname} ${user?.lastname}`}
                  />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box'
            }
          }}
          // variant="persistent"
          variant={isMobile ? 'temporary' : 'persistent'}
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Typography variant="h6">{appConfig.companyName}</Typography>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List disablePadding>
            {MenuSidebar.filter(
              (menuItem) => !ExcludeMenu[user?.role].includes(menuItem.title)
            ).map((menuItem) =>
              menuItem.children ? (
                <Box key={menuItem.id}>
                  <ListItemButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuItemOpen((prevState) => ({
                        ...prevState,
                        [menuItem.id]:
                          prevState[menuItem.id] === undefined
                            ? true
                            : !prevState[menuItem.id]
                      }));
                    }}
                  >
                    <ListItemIcon>{/* <InboxIcon /> */}</ListItemIcon>
                    <ListItemText primary={t(`${menuItem.title}`)} />
                    {menuItemOpen[menuItem.id] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                  <Collapse
                    in={menuItemOpen[menuItem.id]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List disablePadding>
                      {menuItem.children
                        .filter(
                          (subItem) =>
                            !ExcludeMenu[user?.role].includes(subItem.title)
                        )
                        .map((subMenuItem) => (
                          <ListItemButton
                            key={subMenuItem.id}
                            sx={{ pl: 4 }}
                            component={LinkDom}
                            to={subMenuItem.url}
                            selected={subMenuItem.url === location.pathname}
                          >
                            <ListItemIcon>{subMenuItem.icon}</ListItemIcon>
                            <ListItemText primary={t(`${subMenuItem.title}`)} />
                          </ListItemButton>
                        ))}
                    </List>
                  </Collapse>
                </Box>
              ) : (
                <ListItem key={menuItem.id} disablePadding>
                  <ListItemButton
                    component={LinkDom}
                    to={menuItem.url}
                    selected={menuItem.url === location.pathname}
                  >
                    <ListItemIcon>{menuItem.icon}</ListItemIcon>
                    <ListItemText primary={t(`${menuItem.title}`)} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
          <Divider />
        </Drawer>
        <Main open={open} isMobile={isMobile}>
          <DrawerHeader />
          {props.children}
          {renderMobileMenu}
          {RenderChatList}
          <RenderMenu />
        </Main>
      </Box>
      <Footer />
    </>
  );
}

export default NavBar;
