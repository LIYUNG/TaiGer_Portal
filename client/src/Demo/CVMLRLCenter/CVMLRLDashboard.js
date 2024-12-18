import React, { useMemo, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { c1_mrt } from '../Utils/contants';
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

function CVMLRLDashboard(props) {
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

  const open_tasks_arr = open_tasks_with_editors(cVMLRLDashboardState.students);
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
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="basic tabs example"
        >
          <Tab
            label={`${t('In Progress', { ns: 'common' })} (${
              cvmlrl_active_tasks?.length || 0
            })`}
            {...a11yProps(0)}
          />
          <Tab
            label={`${t('No Input', { ns: 'common' })} (${
              cvmlrl_idle_tasks?.length || 0
            })`}
            {...a11yProps(1)}
          />
          <Tab
            label={`${t('Closed', { ns: 'common' })} (${
              cvmlrl_closed_v2?.length || 0
            })`}
            {...a11yProps(2)}
          />
          <Tab
            label={`${t('All', { ns: 'common' })} (${
              cvmlrl_all_v2?.length || 0
            })`}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Banner
          ReadOnlyMode={true}
          bg={'primary'}
          title={'warning'}
          path={'/'}
          text={
            'Received students inputs and Active Tasks. Be aware of the deadline!'
          }
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <ExampleWithLocalizationProvider
          data={cvmlrl_active_tasks}
          col={memoizedColumnsMrt}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Banner
          ReadOnlyMode={true}
          bg={'info'}
          title={'info'}
          path={'/'}
          text={'No student inputs tasks. Agents should push students'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <ExampleWithLocalizationProvider
          data={cvmlrl_idle_tasks}
          col={memoizedColumnsMrt}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Banner
          ReadOnlyMode={true}
          bg={'success'}
          title={'success'}
          path={'/'}
          text={'These tasks are closed'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <Typography sx={{ p: 2 }}>
          {t(
            'Note: if the documents are not closed but locate here, it is because the applications are already submitted. The documents can safely closed eventually.',
            { ns: 'cvmlrl' }
          )}
        </Typography>
        <ExampleWithLocalizationProvider
          data={cvmlrl_closed_v2}
          col={memoizedColumnsMrt}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Banner
          ReadOnlyMode={true}
          bg={'success'}
          title={'info'}
          path={'/'}
          text={'All tasks'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <ExampleWithLocalizationProvider
          data={cvmlrl_all_v2}
          col={memoizedColumnsMrt}
        />
      </CustomTabPanel>
    </>
  );
}

export default CVMLRLDashboard;
