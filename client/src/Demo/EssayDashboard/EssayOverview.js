import React, { useMemo, useEffect, useState } from 'react';
import {
    Tabs,
    Tab,
    Box,
    Typography,
    Link,
    Tooltip,
    Chip,
    IconButton
} from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PropTypes from 'prop-types';
import { is_TaiGer_role } from '@taiger-common/core';

import ModalMain from '../Utils/ModalHandler/ModalMain';
import Banner from '../../components/Banner/Banner';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';
import { MuiDataGrid } from '../../components/MuiDataGrid';
import DEMO from '../../store/constant';
import { ATTRIBUTES, COLORS } from '../../utils/contants';

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

const EssayOverview = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [cVMLRLOverviewState, setCVMLRLOverviewState] = useState({
        error: '',
        isLoaded: props.isLoaded,
        data: null,
        success: props.success,
        students: props.students,
        doc_thread_id: '',
        student_id: '',
        program_id: '',
        SetAsFinalFileModel: false,
        isFinalVersion: false,
        status: '', //reject, accept... etc
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    const memoizedColumns = useMemo(() => {
        return [
            {
                field: 'firstname_lastname',
                headerName: t('First-, Last Name', { ns: 'common' }),
                align: 'left',
                headerAlign: 'left',
                width: 150,
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
                                        color={
                                            params.value ? 'primary' : 'action'
                                        }
                                    />
                                ) : (
                                    <StarBorderRoundedIcon
                                        color={
                                            params.value ? 'primary' : 'action'
                                        }
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
                field: 'outsourced_user_id',
                headerName: t('Essay Writer', { ns: 'common' }),
                align: 'left',
                headerAlign: 'left',
                minWidth: 120,
                renderCell: (params) => {
                    return (
                        params.row.outsourced_user_id?.map((outsourcer) => (
                            <Link
                                component={LinkDom}
                                key={`${outsourcer._id.toString()}`}
                                target="_blank"
                                title={outsourcer.firstname}
                                to={DEMO.TEAM_EDITOR_LINK(
                                    outsourcer._id.toString()
                                )}
                                underline="hover"
                            >
                                {`${outsourcer.firstname} `}
                            </Link>
                        )) || []
                    );
                }
            },
            {
                field: 'editors',
                headerName: t('Editors', { ns: 'common' }),
                align: 'left',
                headerAlign: 'left',
                minWidth: 120,
                renderCell: (params) => {
                    return params.row.editors?.map((editor) => (
                        <Link
                            component={LinkDom}
                            key={`${editor._id.toString()}`}
                            target="_blank"
                            title={editor.firstname}
                            to={DEMO.TEAM_EDITOR_LINK(editor._id.toString())}
                            underline="hover"
                        >
                            {`${editor.firstname} `}
                        </Link>
                    ));
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
                                    [1, 3, 9, 10, 11].includes(
                                        attribute.value
                                    ) && (
                                        <Tooltip
                                            key={attribute._id}
                                            title={`${attribute.name}: ${
                                                ATTRIBUTES[attribute.value - 1]
                                                    .definition
                                            }`}
                                        >
                                            <Chip
                                                color={COLORS[attribute.value]}
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
            {
                field: 'aged_days',
                headerName: t('Aged days', { ns: 'common' }),
                minWidth: 80
            },
            {
                field: 'number_input_from_editors',
                headerName: t('Editor Feedback (#Messages/#Files)', {
                    ns: 'common'
                }),
                minWidth: 80
            },
            {
                field: 'number_input_from_student',
                headerName: t('Student Feedback (#Messages/#Files)', {
                    ns: 'common'
                }),
                minWidth: 80
            },
            {
                field: 'latest_reply',
                headerName: t('Latest Reply', { ns: 'common' }),
                minWidth: 100
            },
            {
                field: 'updatedAt',
                headerName: t('Last Update', { ns: 'common' }),
                minWidth: 100
            }
        ];
    }, [t, props, user]);

    const { res_modal_status, res_modal_message, isLoaded } =
        cVMLRLOverviewState;

    if (!isLoaded && !cVMLRLOverviewState.students) {
        return <Loading />;
    }

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
                    onChange={handleChange}
                    scrollButtons="auto"
                    value={value}
                    variant="scrollable"
                >
                    <Tab
                        label={`NO ESSAY WRITER (${
                            props.no_essay_writer_tasks?.length || 0
                        }) `}
                        {...a11yProps(value, 0)}
                    />
                    <Tab
                        label={`TODO (${props.new_message_tasks?.length || 0}) `}
                        {...a11yProps(value, 1)}
                    />
                    <Tab
                        label={`My Favorites (${props.fav_message_tasks?.length || 0})`}
                        {...a11yProps(value, 2)}
                    />
                    <Tab
                        label={`FOLLOW UP (${props.followup_tasks?.length || 0})`}
                        {...a11yProps(value, 3)}
                    />
                    <Tab
                        label={`NO ACTION (${props.pending_progress_tasks?.length || 0})`}
                        {...a11yProps(value, 4)}
                    />
                    <Tab
                        label={`CLOSED (${props.closed_tasks?.length || 0})`}
                        {...a11yProps(value, 5)}
                    />
                    <Tab
                        label={`All (${props.all_active_message_tasks?.length || 0})`}
                        {...a11yProps(value, 6)}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel index={0} value={value}>
                <Banner
                    ReadOnlyMode={true}
                    bg="danger"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="Please assign essay writer to the following essays:"
                    title="warning"
                />
                <MuiDataGrid
                    columnVisibilityModel={{
                        number_input_from_editors: false,
                        number_input_from_student: false
                    }}
                    columns={memoizedColumns}
                    rows={props.no_essay_writer_tasks}
                />
            </CustomTabPanel>
            <CustomTabPanel index={1} value={value}>
                <Banner
                    ReadOnlyMode={true}
                    bg="danger"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="Follow up"
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
            <CustomTabPanel index={2} value={value}>
                <Banner
                    ReadOnlyMode={true}
                    bg="primary"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="My Favorite"
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
            <CustomTabPanel index={3} value={value}>
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
            <CustomTabPanel index={4} value={value}>
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
            <CustomTabPanel index={5} value={value}>
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
            <CustomTabPanel index={6} value={value}>
                <Banner
                    ReadOnlyMode={true}
                    bg="info"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="All Essays"
                    title="info"
                />
                <MuiDataGrid
                    columnVisibilityModel={{
                        number_input_from_editors: false,
                        number_input_from_student: false
                    }}
                    columns={memoizedColumns}
                    rows={props.all_active_message_tasks}
                />
            </CustomTabPanel>
        </>
    );
};

export default EssayOverview;
