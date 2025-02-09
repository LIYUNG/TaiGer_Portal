import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link as LinkDom } from 'react-router-dom';
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
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, Link, Tooltip, useMediaQuery } from '@mui/material';
import {
    is_TaiGer_Agent,
    is_TaiGer_Admin,
    is_TaiGer_Editor,
    is_TaiGer_Student,
    is_TaiGer_AdminAgent
} from '@taiger-common/core';
import i18next from 'i18next';

import {
    getActiveEventsNumber,
    getMyCommunicationUnreadNumber
} from '../../api/index';
import { appConfig } from '../../config';
import { useAuth } from '../AuthProvider';
import NavSearch from './NavSearch';
import ChatList from '../ChatList';
import { stringAvatar } from '../../utils/contants';
import Loading from '../Loading/Loading';
import DEMO from '../../store/constant';
import { CustomDrawer } from './Drawer';

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open, ismobile }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        maxHeight: 'calc(100vh - 64px)',
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        marginLeft: ismobile === 'true' ? 0 : `-${drawerWidth}px`,
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
    shouldForwardProp: (prop) => prop !== 'popperRef'
})(({ theme, open, ismobile }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    // width: `calc(100% - ${0}px)`,
    marginLeft: ismobile === 'true' ? 0 : `-${drawerWidth}px`,
    ...(open && {
        width: ismobile === 'true' ? '100%' : `calc(100% - ${drawerWidth}px)`,
        // marginLeft: ismobile ? `${drawerWidth}px` : 0,
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

const RenderMenu = ({
    anchorEl,
    handleClose,
    isMenuOpen,
    handleCloseProfile,
    handleCloseSettings,
    handleCloseLogout,
    user
}) => (
    <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="account-menu"
        onClick={handleClose}
        onClose={handleClose}
        open={isMenuOpen}
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
    >
        <MenuItem onClick={handleCloseProfile}>
            <Avatar />
            {`${user.firstname} ${user.lastname}`}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCloseSettings}>
            <ListItemIcon>
                <Settings fontSize="small" />
            </ListItemIcon>
            {i18next.t('Settings', { ns: 'common' })}
        </MenuItem>
        <MenuItem onClick={handleCloseLogout}>
            <ListItemIcon>
                <Logout fontSize="small" />
            </ListItemIcon>
            {i18next.t('Log Out', { ns: 'common' })}
        </MenuItem>
    </Menu>
);

const NavBar = (props) => {
    const { user, isAuthenticated, isLoaded, logout } = useAuth();
    const theme = useTheme();
    const ismobile = useMediaQuery(theme.breakpoints.down('md'));
    const logoLink = ismobile
        ? `${appConfig.logoSmallNoText}.svg`
        : `${appConfig.darkLogoSmall}.svg`;
    const [open, setOpen] = useState(ismobile ? false : true);
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
        if (is_TaiGer_AdminAgent(user) || is_TaiGer_Student(user)) {
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
        }
    }, [isLoaded, user]);

    useEffect(() => {
        // Start the periodic polling after the component is mounted
        if (is_TaiGer_AdminAgent(user) || is_TaiGer_Student(user)) {
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
        }

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
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            id={chatId}
            onClick={handleCloseChat}
            onClose={handleCloseChat}
            open={isChatListOpen}
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
        >
            <ChatList handleCloseChat={handleCloseChat} />
        </Menu>
    );
    const menuId = 'primary-search-account-menu';

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
            onClose={handleMobileMenuClose}
            open={isMobileMenuOpen}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
            }}
        >
            {is_TaiGer_Agent(user) || is_TaiGer_Student(user) ? (
                <MenuItem onClick={handleNavigateCalendar}>
                    <IconButton
                        aria-label="show upcoming meeting event"
                        color="inherit"
                        size="large"
                    >
                        <Badge
                            badgeContent={navState.activeEventCount}
                            color="error"
                        >
                            <CalendarMonthIcon />
                        </Badge>
                    </IconButton>
                    <Typography>
                        {i18next.t('Calendar', { ns: 'common' })}
                    </Typography>
                </MenuItem>
            ) : null}
            {is_TaiGer_AdminAgent(user) || is_TaiGer_Student(user) ? (
                <MenuItem onClick={handleOpenChat}>
                    <IconButton
                        aria-controls={menuId}
                        aria-haspopup="true"
                        aria-label="show unread new messages"
                        color="inherit"
                        size="large"
                    >
                        <Badge
                            badgeContent={navState.unreadCount}
                            color="error"
                        >
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <Typography>
                        {i18next.t('Messages', { ns: 'common' })}
                    </Typography>
                </MenuItem>
            ) : null}
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    aria-label="account of current user"
                    color="inherit"
                    size="large"
                >
                    <AccountCircle />
                </IconButton>
                <Typography>
                    {i18next.t('Profile', { ns: 'common' })}
                </Typography>
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
    }
    return (
        <Box
            data-testid="navbar_component"
            onClick={() => {
                if (ismobile) {
                    handleDrawerClose();
                }
            }}
            sx={{
                // minHeight: '100vh',
                display: 'flex'
            }}
        >
            <CssBaseline />
            <AppBar ismobile={ismobile.toString()} open={open} position="fixed">
                <Toolbar>
                    <IconButton
                        aria-label="open drawer"
                        color="inherit"
                        edge="start"
                        onClick={(e) => handleDrawerOpen(e)}
                        sx={{ ...(!ismobile && open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link
                        component={LinkDom}
                        style={{ textDecoration: 'none' }}
                        to={DEMO.DASHBOARD_LINK}
                    >
                        <img
                            alt="Logo"
                            src={logoLink}
                            style={{ maxHeight: '48px', marginRight: '2px' }}
                        />
                    </Link>
                    {is_TaiGer_Agent(user) ||
                    is_TaiGer_Editor(user) ||
                    is_TaiGer_Admin(user) ? (
                        <NavSearch />
                    ) : null}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {is_TaiGer_Agent(user) || is_TaiGer_Student(user) ? (
                            <IconButton
                                aria-label="show active event"
                                color="inherit"
                                onClick={handleNavigateCalendar}
                                size="large"
                            >
                                <Badge
                                    badgeContent={navState.activeEventCount}
                                    color="error"
                                >
                                    <CalendarMonthIcon />
                                </Badge>
                            </IconButton>
                        ) : null}
                        {is_TaiGer_AdminAgent(user) ||
                        is_TaiGer_Student(user) ? (
                            <IconButton
                                aria-controls={chatId}
                                aria-haspopup="true"
                                aria-label="show unread new messages"
                                color="inherit"
                                onClick={handleOpenChat}
                                size="large"
                            >
                                <Badge
                                    badgeContent={navState.unreadCount}
                                    color="error"
                                >
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                        ) : null}
                        <Tooltip
                            placement="bottom-start"
                            title="Account settings"
                        >
                            <IconButton
                                aria-controls={menuId}
                                aria-haspopup="true"
                                aria-label="account of current user"
                                color="inherit"
                                edge="end"
                                onClick={handleProfileMenuOpen}
                                size="large"
                            >
                                <Avatar
                                    {...stringAvatar(
                                        `${user?.firstname} ${user?.lastname}`
                                    )}
                                    size="small"
                                    title={`${user?.firstname} ${user?.lastname}`}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        {is_TaiGer_Agent(user) || is_TaiGer_Student(user) ? (
                            <IconButton
                                aria-label="show active event"
                                color="inherit"
                                onClick={handleNavigateCalendar}
                                size="large"
                            >
                                <Badge
                                    badgeContent={navState.activeEventCount}
                                    color="error"
                                >
                                    <CalendarMonthIcon />
                                </Badge>
                            </IconButton>
                        ) : null}
                        {is_TaiGer_AdminAgent(user) ||
                        is_TaiGer_Student(user) ? (
                            <IconButton
                                aria-controls={chatId}
                                aria-haspopup="true"
                                aria-label="show unread new messages"
                                color="inherit"
                                onClick={handleOpenChat}
                                size="large"
                            >
                                <Badge
                                    badgeContent={navState.unreadCount}
                                    color="error"
                                >
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                        ) : null}
                        <Tooltip
                            placement="bottom-start"
                            title="Account settings"
                        >
                            <IconButton
                                aria-controls={menuId}
                                aria-haspopup="true"
                                aria-label="account of current user"
                                color="inherit"
                                edge="end"
                                onClick={handleProfileMenuOpen}
                                size="large"
                                sx={{
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1
                                    }
                                }}
                            >
                                <Avatar
                                    {...stringAvatar(
                                        `${user?.firstname} ${user?.lastname}`
                                    )}
                                    size="small"
                                    title={`${user?.firstname} ${user?.lastname}`}
                                />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
            <CustomDrawer
                handleDrawerClose={handleDrawerClose}
                ismobile={ismobile}
                open={open}
                theme={theme}
            />
            <Main ismobile={ismobile.toString()} open={open}>
                <DrawerHeader />
                {props.children}
                {renderMobileMenu}
                {RenderChatList}
                <RenderMenu
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    handleCloseLogout={handleCloseLogout}
                    handleCloseProfile={handleCloseProfile}
                    handleCloseSettings={handleCloseSettings}
                    isMenuOpen={isMenuOpen}
                    user={user}
                />
            </Main>
        </Box>
    );
};

export default NavBar;
