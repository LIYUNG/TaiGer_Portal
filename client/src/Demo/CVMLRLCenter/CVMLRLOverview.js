import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { Tabs, Tab, Box, Typography, Link, Tooltip, Chip } from '@mui/material';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

import { ATTRIBUTES, COLORS, c2Student } from '../Utils/contants';
import { is_TaiGer_role } from '../Utils/checking-functions';
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

function CVMLRLOverview(props) {
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

  const c2 = [
    {
      field: 'firstname_lastname',
      headerName: 'First-, Last Name',
      align: 'left',
      headerAlign: 'left',
      width: 200,
      renderCell: (params) => {
        const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
          params.row.student_id,
          DEMO.PROFILE_HASH
        )}`;
        return (
          <>
            <IconButton onClick={() => props.handleFavoriteToggle(params.row.id)}>
              {params.row.flag_by_user_id?.includes(user._id.toString()) ? (
                <StarRoundedIcon color={params.value ? 'primary' : 'action'} />
              ) : (
                <StarBorderRoundedIcon
                  color={params.value ? 'primary' : 'action'}
                />
              )}
            </IconButton>

            <Link
              underline="hover"
              to={linkUrl}
              component={LinkDom}
              target="_blank"
              title={params.value}
            >
              {params.value}
            </Link>
          </>
        );
      }
    },
    {
      field: 'deadline',
      headerName: 'Deadline',
      width: 100
    },
    {
      field: 'days_left',
      headerName: 'Days left',
      width: 80
    },
    {
      field: 'document_name',
      headerName: 'Document name',
      width: 380,
      renderCell: (params) => {
        const linkUrl = `${DEMO.DOCUMENT_MODIFICATION_LINK(
          params.row.thread_id
        )}`;
        return (
          <>
            {params.row?.attributes?.map(
              (attribute) =>
                [1, 3, 9, 10].includes(attribute.value) && (
                  <Tooltip
                    title={`${attribute.name}: ${
                      ATTRIBUTES[attribute.value - 1].definition
                    }`}
                    key={attribute._id}
                  >
                    <Chip
                      size="small"
                      data-testid={`chip-${attribute.name}`}
                      label={attribute.name[0]}
                      color={COLORS[attribute.value]}
                    />
                  </Tooltip>
                )
            )}
            <Link
              underline="hover"
              to={linkUrl}
              component={LinkDom}
              target="_blank"
              title={params.value}
            >
              {params.value}
            </Link>
          </>
        );
      }
    },
    {
      field: 'aged_days',
      headerName: 'Aged days',
      width: 80
    },
    {
      field: 'number_input_from_editors',
      headerName: 'Editor Feedback (#Messages/#Files)',
      width: 80
    },
    {
      field: 'number_input_from_student',
      headerName: 'Student Feedback (#Messages/#Files)',
      width: 80
    },
    {
      field: 'latest_reply',
      headerName: 'Latest Reply',
      width: 100
    },
    {
      field: 'updatedAt',
      headerName: 'Last Update',
      width: 100
    }
  ];

  const memoizedColumns = is_TaiGer_role(user) ? c2 : c2Student;

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
            label={`TODO (${props.new_message_tasks?.length || 0}) `}
            {...a11yProps(0)}
          />
          <Tab
            label={`FOLLOW UP (${props.followup_tasks?.length || 0})`}
            {...a11yProps(1)}
          />
          <Tab
            label={`NO ACTION (${props.pending_progress_tasks?.length || 0})`}
            {...a11yProps(2)}
          />
          <Tab
            label={`CLOSED (${props.closed_tasks?.length || 0})`}
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
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
        <MuiDataGrid rows={props.new_message_tasks} columns={memoizedColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
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
        <MuiDataGrid rows={props.followup_tasks} columns={memoizedColumns} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
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
        <MuiDataGrid
          rows={props.pending_progress_tasks}
          columns={memoizedColumns}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
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
        <MuiDataGrid rows={props.closed_tasks} columns={memoizedColumns} />
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

export default CVMLRLOverview;
