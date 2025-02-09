import React, { useMemo, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { c1_mrt } from '../../utils/contants';
import {
    // open_tasks,
    open_tasks_with_editors
} from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import Banner from '../../components/Banner/Banner';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import Loading from '../../components/Loading/Loading';
import ExampleWithLocalizationProvider from '../../components/MaterialReactTable';

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

const CVMLRLDashboard = (props) => {
    const { t } = useTranslation();
    const memoizedColumnsMrt = useMemo(() => c1_mrt, []);
    const [cVMLRLDashboardState, setCVMLRLDashboardState] = useState({
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

    const ConfirmError = () => {
        setCVMLRLDashboardState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const { res_modal_status, res_modal_message, isLoaded } =
        cVMLRLDashboardState;

    if (!isLoaded && !cVMLRLDashboardState.students) {
        return <Loading />;
    }

    const open_tasks_arr = open_tasks_with_editors(
        cVMLRLDashboardState.students
    );
    // const open_tasks_arr2 = open_tasks(cVMLRLDashboardState.students);

    const cvmlrl_active_tasks = open_tasks_arr.filter(
        (open_task) =>
            open_task.show &&
            !open_task.isFinalVersion &&
            open_task.latest_message_left_by_id !== ''
    );
    const cvmlrl_idle_tasks = open_tasks_arr.filter(
        (open_task) =>
            open_task.show &&
            !open_task.isFinalVersion &&
            open_task.latest_message_left_by_id === ''
    );

    const cvmlrl_closed_v2 = open_tasks_arr.filter(
        (open_task) => open_task.show && open_task.isFinalVersion
    );

    const cvmlrl_all_v2 = open_tasks_arr.filter((open_task) => open_task.show);

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
                        label={`${t('In Progress', { ns: 'common' })} (${
                            cvmlrl_active_tasks?.length || 0
                        })`}
                        {...a11yProps(value, 0)}
                    />
                    <Tab
                        label={`${t('No Input', { ns: 'common' })} (${
                            cvmlrl_idle_tasks?.length || 0
                        })`}
                        {...a11yProps(value, 1)}
                    />
                    <Tab
                        label={`${t('Closed', { ns: 'common' })} (${
                            cvmlrl_closed_v2?.length || 0
                        })`}
                        {...a11yProps(value, 2)}
                    />
                    <Tab
                        label={`${t('All', { ns: 'common' })} (${
                            cvmlrl_all_v2?.length || 0
                        })`}
                        {...a11yProps(value, 2)}
                    />
                </Tabs>
            </Box>
            <CustomTabPanel index={0} value={value}>
                <Banner
                    ReadOnlyMode={true}
                    bg="primary"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="Received students inputs and Active Tasks. Be aware of the deadline!"
                    title="warning"
                />
                <ExampleWithLocalizationProvider
                    col={memoizedColumnsMrt}
                    data={cvmlrl_active_tasks}
                />
            </CustomTabPanel>
            <CustomTabPanel index={1} value={value}>
                <Banner
                    ReadOnlyMode={true}
                    bg="info"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="No student inputs tasks. Agents should push students"
                    title="info"
                />
                <ExampleWithLocalizationProvider
                    col={memoizedColumnsMrt}
                    data={cvmlrl_idle_tasks}
                />
            </CustomTabPanel>
            <CustomTabPanel index={2} value={value}>
                <Banner
                    ReadOnlyMode={true}
                    bg="success"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="These tasks are closed"
                    title="success"
                />
                <Typography sx={{ p: 2 }}>
                    {t(
                        'Note: if the documents are not closed but locate here, it is because the applications are already submitted. The documents can safely closed eventually.',
                        { ns: 'cvmlrl' }
                    )}
                </Typography>
                <ExampleWithLocalizationProvider
                    col={memoizedColumnsMrt}
                    data={cvmlrl_closed_v2}
                />
            </CustomTabPanel>
            <CustomTabPanel index={3} value={value}>
                <Banner
                    ReadOnlyMode={true}
                    bg="success"
                    link_name=""
                    notification_key={undefined}
                    path="/"
                    removeBanner={null}
                    text="All tasks"
                    title="info"
                />
                <ExampleWithLocalizationProvider
                    col={memoizedColumnsMrt}
                    data={cvmlrl_all_v2}
                />
            </CustomTabPanel>
        </>
    );
};

export default CVMLRLDashboard;
