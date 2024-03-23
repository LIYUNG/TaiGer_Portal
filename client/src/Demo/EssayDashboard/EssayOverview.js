import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import {
  cvmlrl_overview_header,
  cvmlrl_overview_closed_header
} from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import Banner from '../../components/Banner/Banner';
import SortTable from '../../components/SortTable/SortTable';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { CustomTabPanel, a11yProps } from '../../components/Tabs';
import { useTranslation } from 'react-i18next';

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function EssayOverview(props) {
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

  const { res_modal_status, res_modal_message, isLoaded } = cVMLRLOverviewState;

  if (!isLoaded && !cVMLRLOverviewState.students) {
    return <Loading />;
  }

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
            label={`NO ESSAY WRITER (${
              props.no_essay_writer_tasks?.length || 0
            }) `}
            {...a11yProps(0)}
          />
          <Tab
            label={`TODO (${props.new_message_tasks?.length || 0}) `}
            {...a11yProps(1)}
          />
          <Tab
            label={`FOLLOW UP (${props.followup_tasks?.length || 0})`}
            {...a11yProps(2)}
          />
          <Tab
            label={`NO ACTION (${props.pending_progress_tasks?.length || 0})`}
            {...a11yProps(3)}
          />
          <Tab
            label={`CLOSED (${props.closed_tasks?.length || 0})`}
            {...a11yProps(4)}
          />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Banner
          ReadOnlyMode={true}
          bg={'danger'}
          title={'warning'}
          path={'/'}
          text={'Please assign essay writer to the following essays:'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_header}
          data={props.no_essay_writer_tasks}
          user={user}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Banner
          ReadOnlyMode={true}
          bg={'danger'}
          title={'warning'}
          path={'/'}
          text={'Please reply:'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_header}
          data={props.new_message_tasks}
          user={user}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Banner
          ReadOnlyMode={true}
          bg={'primary'}
          title={'info'}
          path={'/'}
          text={'Follow up'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_header}
          data={props.followup_tasks}
          user={user}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Banner
          ReadOnlyMode={true}
          bg={'info'}
          title={is_TaiGer_role(user) ? 'info' : 'warning'}
          path={'/'}
          text={
            is_TaiGer_role(user)
              ? 'Waiting inputs. No action needed'
              : 'Please provide input as soon as possible'
          }
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_header}
          data={props.pending_progress_tasks}
          user={user}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <Banner
          ReadOnlyMode={true}
          bg={'success'}
          title={'success'}
          path={'/'}
          text={'These tasks are closed.'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <SortTable
          columns={cvmlrl_overview_closed_header}
          data={props.closed_tasks}
          user={user}
        />
        <Typography variant="body2">
          {t(
            'Note: if the documents are not closed but locate here, it is becaue the applications are already submitted. The documents can safely closed eventually.',
            { ns: 'cvmlrl' }
          )}
        </Typography>
      </CustomTabPanel>
    </>
  );
}

export default EssayOverview;
