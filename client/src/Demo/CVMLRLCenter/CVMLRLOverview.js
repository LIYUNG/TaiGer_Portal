import React, { useEffect, useState } from 'react';
import { Link as LinkDom, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box, Typography, Link, Tooltip, Chip } from '@mui/material';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { is_TaiGer_role } from '@taiger-common/core';

import {
    ATTRIBUTES,
    COLORS,
    THREADS_TABLE_REVERSED_TABS,
    THREADS_TABLE_TABS
} from '../../utils/contants';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import Banner from '../../components/Banner/Banner';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';
import { MuiDataGrid } from '../../components/MuiDataGrid';
import DEMO from '../../store/constant';

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

const CVMLRLOverview = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { hash } = useLocation();
    const [tabTag, setTabTag] = useState(
        THREADS_TABLE_TABS[hash.replace('#', '')] || 0
    );
    const handleTabChange = (event, newValue) => {
        setTabTag(newValue);
        window.location.hash = THREADS_TABLE_REVERSED_TABS[newValue];
    };

    const [cVMLRLOverviewState, setCVMLRLOverviewState] = useState({
        error: '',
        isLoaded: props.isLoaded,
        data: null,
        success: props.success,
        students: props.students,
        student_id: '',
        status: '', //reject, accept... etc
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });

    useEffect(() => {
        setCVMLRLOverviewState((prevState) => ({
            ...prevState,
            students: props.students
        }));
    }, [props.students]);

    const ConfirmError = () => {
        setCVMLRLOverviewState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const { res_modal_status, res_modal_message, isLoaded } =
        cVMLRLOverviewState;

    if (!isLoaded && !cVMLRLOverviewState.students) {
        return <Loading />;
    }

    const commonColumn = [
        {
            field: 'aged_days',
            headerName: 'Aged days',
            minWidth: 80
        },
        {
            field: 'number_input_from_editors',
            headerName: t('Editor Feedback (#Messages/#Files)', {
                ns: 'common'
            }),
            width: 80
        },
        {
            field: 'number_input_from_student',
            headerName: t('Student Feedback (#Messages/#Files)', {
                ns: 'common'
            }),
            width: 80
        },
        {
            field: 'latest_reply',
            headerName: t('Latest Reply', { ns: 'common' }),
            width: 100
        },
        {
            field: 'updatedAt',
            headerName: t('Last Update', { ns: 'common' }),
            width: 100
        }
    ];

    const c2 = [
        {
            field: 'firstname_lastname',
            headerName: t('First-, Last Name', { ns: 'common' }),
            align: 'left',
            headerAlign: 'left',
            minWidth: 200,
            renderCell: (params) => {
                const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    params.row.student_id,
                    DEMO.PROFILE_HASH
                )}`;
                return (
                    <>
                        <IconButton
                            onClick={() =>
                                props.handleFavoriteToggle(params.row.id)
                            }
                        >
                            {params.row.flag_by_user_id?.includes(
                                user._id.toString()
                            ) ? (
                                <StarRoundedIcon
                                    color={params.value ? 'primary' : 'action'}
                                />
                            ) : (
                                <StarBorderRoundedIcon
                                    color={params.value ? 'primary' : 'action'}
                                />
                            )}
                        </IconButton>
                        <Link
                            component={LinkDom}
                            target="_blank"
                            title={params.value}
                            to={linkUrl}
                            underline="hover"
                        >
                            {params.value}
                        </Link>
                    </>
                );
            }
        },
        {
            field: 'deadline',
            headerName: t('Deadline', { ns: 'common' }),
            minWidth: 100
        },
        {
            field: 'days_left',
            headerName: t('Days left', { ns: 'common' }),
            minWidth: 80
        },
        {
            field: 'lang',
            headerName: t('Program Language', { ns: 'common' }),
            minWidth: 80
        },
        {
            field: 'document_name',
            headerName: t('Document name', { ns: 'common' }),
            minWidth: 380,
            renderCell: (params) => {
                const linkUrl = `${DEMO.DOCUMENT_MODIFICATION_LINK(
                    params.row.thread_id
                )}`;
                return (
                    <>
                        {params.row?.attributes?.map(
                            (attribute) =>
                                [1, 3, 9, 10, 11].includes(attribute.value) && (
                                    <Tooltip
                                        key={attribute._id}
                                        title={`${attribute.name}: ${
                                            ATTRIBUTES[attribute.value - 1]
                                                .definition
                                        }`}
                                    >
                                        <Chip
                                            color={COLORS[attribute.value]}
                                            data-testid={`chip-${attribute.name}`}
                                            label={attribute.name[0]}
                                            size="small"
                                        />
                                    </Tooltip>
                                )
                        )}
                        <Link
                            component={LinkDom}
                            target="_blank"
                            title={params.value}
                            to={linkUrl}
                            underline="hover"
                        >
                            {params.value}
                        </Link>
                    </>
                );
            }
        },
        ...commonColumn
    ];

    const c2Student = [
        {
            field: 'firstname_lastname',
            headerName: t('First-, Last Name', { ns: 'common' }),
            align: 'left',
            headerAlign: 'left',
            width: 200,
            renderCell: (params) => {
                return (
                    <>
                        <IconButton
                            onClick={() =>
                                props.handleFavoriteToggle(params.row.id)
                            }
                        >
                            {params.row.flag_by_user_id?.includes(
                                user._id.toString()
                            ) ? (
                                <StarRoundedIcon
                                    color={params.value ? 'primary' : 'action'}
                                />
                            ) : (
                                <StarBorderRoundedIcon
                                    color={params.value ? 'primary' : 'action'}
                                />
                            )}
                        </IconButton>
                        <span title={params.value}>{params.value}</span>
                    </>
                );
            }
        },
        {
            field: 'deadline',
            headerName: t('Deadline', { ns: 'common' }),
            width: 120
        },
        {
            field: 'days_left',
            headerName: t('Days left', { ns: 'common' }),
            width: 80
        },
        {
            field: 'document_name',
            headerName: t('Document name', { ns: 'common' }),
            width: 450,
            renderCell: (params) => {
                const linkUrl = `${DEMO.DOCUMENT_MODIFICATION_LINK(
                    params.row.thread_id
                )}`;
                return (
                    <Link
                        component={LinkDom}
                        target="_blank"
                        title={params.value}
                        to={linkUrl}
                        underline="hover"
                    >
                        {params.value}
                    </Link>
                );
            }
        },
        ...commonColumn
    ];

    const memoizedColumns = is_TaiGer_role(user) ? c2 : c2Student;

    return (
        <>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    aria-label="basic tabs example"
                    onChange={handleTabChange}
                    scrollButtons="auto"
                    value={tabTag}
                    variant="scrollable"
                >
                    <Tab
                        label={`${t('TODO', { ns: 'common' })} (${
                            props.new_message_tasks?.length || 0
                        }) `}
                        {...a11yProps(tabTag, 0)}
                    />
                    <Tab
                        label={`${t('My Favorites', { ns: 'common' })} (${
                            props.fav_message_tasks?.length || 0
                        })`}
                        {...a11yProps(tabTag, 1)}
                    />
                    <Tab
                        label={`${t('Follow up', { ns: 'common' })} (${
                            props.followup_tasks?.length || 0
                        })`}
                        {...a11yProps(tabTag, 2)}
                    />
                    <Tab
                        label={`${t('No Action', { ns: 'common' })} (${
                            props.pending_progress_tasks?.length || 0
                        })`}
                        {...a11yProps(tabTag, 3)}
                    />
                    <Tab
                        label={`${t('Closed', { ns: 'common' })} (${
                            props.closed_tasks?.length || 0
                        })`}
                        {...a11yProps(tabTag, 4)}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel index={0} value={tabTag}>
                <Banner
                    ReadOnlyMode={true}
                    bg="danger"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="Please reply:"
                    title="warning"
                />
                <MuiDataGrid
                    columnVisibilityModel={{
                        number_input_from_editors: false,
                        number_input_from_student: false
                    }}
                    columns={memoizedColumns}
                    rows={props.new_message_tasks}
                />
            </CustomTabPanel>
            <CustomTabPanel index={1} value={tabTag}>
                <Banner
                    ReadOnlyMode={true}
                    bg="primary"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="Follow up"
                    title="info"
                />
                <MuiDataGrid
                    columnVisibilityModel={{
                        number_input_from_editors: false,
                        number_input_from_student: false
                    }}
                    columns={memoizedColumns}
                    rows={props.fav_message_tasks}
                />
            </CustomTabPanel>
            <CustomTabPanel index={2} value={tabTag}>
                <Banner
                    ReadOnlyMode={true}
                    bg="primary"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="Follow up"
                    title="info"
                />
                <MuiDataGrid
                    columnVisibilityModel={{
                        number_input_from_editors: false,
                        number_input_from_student: false
                    }}
                    columns={memoizedColumns}
                    rows={props.followup_tasks}
                />
            </CustomTabPanel>
            <CustomTabPanel index={3} value={tabTag}>
                <Banner
                    ReadOnlyMode={true}
                    bg="info"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text={
                        is_TaiGer_role(user)
                            ? 'Waiting inputs. No action needed'
                            : 'Please provide input as soon as possible'
                    }
                    title={is_TaiGer_role(user) ? 'info' : 'warning'}
                />
                <MuiDataGrid
                    columnVisibilityModel={{
                        number_input_from_editors: false,
                        number_input_from_student: false
                    }}
                    columns={memoizedColumns}
                    rows={props.pending_progress_tasks}
                />
            </CustomTabPanel>
            <CustomTabPanel index={4} value={tabTag}>
                <Banner
                    ReadOnlyMode={true}
                    bg="success"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="These tasks are closed."
                    title="success"
                />
                <MuiDataGrid
                    columnVisibilityModel={{
                        number_input_from_editors: false,
                        number_input_from_student: false
                    }}
                    columns={memoizedColumns}
                    rows={props.closed_tasks}
                />
                <Typography variant="body2">
                    {t(
                        'Note: if the documents are not closed but locate here, it is because the applications are already submitted. The documents can safely closed eventually.',
                        { ns: 'cvmlrl' }
                    )}
                </Typography>
            </CustomTabPanel>
        </>
    );
};

export default CVMLRLOverview;
