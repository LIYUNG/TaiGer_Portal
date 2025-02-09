import React, { useState } from 'react';
import {
    Box,
    Collapse,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import { appConfig } from '../../config';
import { MenuSidebar } from '../../menu-sidebar';
import { useAuth } from '../AuthProvider';
import { useTranslation } from 'react-i18next';
import Footer from '../Footer/Footer';

const drawerWidth = 300;

const ExcludeMenu = {
    Guest: [
        'my-students',
        'user-list',
        'program-table',
        'all-students',
        'tools-widgets',
        'teams_overview',
        'internal-document-database',
        'internal-docs'
    ],
    External: [
        'my-students',
        'user-list',
        'application_overivew',
        'contact_us',
        'all-students',
        'academicsurvey',
        'my-courses',
        'teams_overview',
        'internal-document-database',
        'download',
        'customer-center-student',
        'docs',
        'internal-docs'
    ],
    Student: [
        'my-students',
        'user-list',
        'program-table',
        'all-students',
        'tools-widgets',
        'teams_overview',
        'internal-document-database',
        'internal-docs'
    ],
    Agent: [
        'contact_us',
        'application_overivew',
        'user-list',
        'academicsurvey',
        'my-courses',
        'customer-center-student'
    ],
    Editor: [
        'contact_us',
        'application_overivew',
        'user-list',
        'tools-widgets',
        'academicsurvey',
        'my-courses',
        'customer-center-student'
    ],
    Admin: [
        'my-students',
        'contact_us',
        'application_overivew',
        'academicsurvey',
        'my-courses',
        'customer-center-student'
    ]
};

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end'
}));

export const CustomDrawer = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const initialMenuItemOpen =
        MenuSidebar?.filter(
            (menuItem) =>
                !ExcludeMenu[user?.role]?.includes(menuItem.id) &&
                menuItem.children?.length > 0
        ).reduce((acc, menuItem) => {
            acc[menuItem.id] = menuItem.children?.some(
                (subItem) => subItem.url === location.pathname
            );
            return acc;
        }, {}) || {};
    const [menuItemOpen, setMenuItemOpen] = useState(initialMenuItemOpen);

    return (
        <Drawer
            anchor="left"
            data-testid="navbar_drawer_component"
            open={props.open}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box'
                }
            }}
            variant={props.ismobile ? 'temporary' : 'persistent'}
        >
            <DrawerHeader>
                <Typography variant="h6">{appConfig.companyName}</Typography>
                <IconButton onClick={props.handleDrawerClose}>
                    {props.theme.direction === 'ltr' ? (
                        <ChevronLeftIcon />
                    ) : (
                        <ChevronRightIcon />
                    )}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List disablePadding>
                {MenuSidebar.filter(
                    (menuItem) => !ExcludeMenu[user?.role].includes(menuItem.id)
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
                                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                <ListItemText
                                    primary={t(`${menuItem.title}`, {
                                        ns: 'common',
                                        tenant: menuItem?.tenant
                                    })}
                                />
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
                                                !ExcludeMenu[
                                                    user?.role
                                                ].includes(subItem.id)
                                        )
                                        .map((subMenuItem) => (
                                            <ListItemButton
                                                component={LinkDom}
                                                key={subMenuItem.id}
                                                selected={
                                                    subMenuItem.url ===
                                                    location.pathname
                                                }
                                                sx={{ pl: 4 }}
                                                to={subMenuItem.url}
                                            >
                                                <ListItemIcon>
                                                    {subMenuItem.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={t(
                                                        `${subMenuItem.title}`,
                                                        {
                                                            ns: 'common',
                                                            tenant: `${subMenuItem?.tenant}`
                                                        }
                                                    )}
                                                />
                                            </ListItemButton>
                                        ))}
                                </List>
                            </Collapse>
                        </Box>
                    ) : (
                        <ListItem disablePadding key={menuItem.id}>
                            <ListItemButton
                                component={LinkDom}
                                selected={menuItem.url === location.pathname}
                                to={menuItem.url}
                            >
                                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                                <ListItemText
                                    primary={t(`${menuItem.title}`, {
                                        ns: 'common',
                                        tenant: `${menuItem?.tenant}`
                                    })}
                                />
                            </ListItemButton>
                        </ListItem>
                    )
                )}
            </List>
            <Divider />
            <div style={{ position: 'relative', bottom: 0, width: '100%' }}>
                <Footer />
            </div>
        </Drawer>
    );
};
