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
                onClick={() => props.handleFavoriteToggle(params.row.id)}
              >
                {params.row.flag_by_user_id?.includes(user._id.toString()) ? (
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
        field: 'outsourced_user_id',
        headerName: t('Essay Writer', { ns: 'common' }),
        align: 'left',
        headerAlign: 'left',
        minWidth: 120,
        renderCell: (params) => {
          return (
            params.row.outsourced_user_id?.map((outsourcer) => (
              <Link
                underline="hover"
                to={DEMO.TEAM_EDITOR_LINK(outsourcer._id.toString())}
                component={LinkDom}
                target="_blank"
                title={outsourcer.firstname}
                key={`${outsourcer._id.toString()}`}
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
              underline="hover"
              to={DEMO.TEAM_EDITOR_LINK(editor._id.toString())}
              component={LinkDom}
              target="_blank"
              title={editor.firstname}
              key={`${editor._id.toString()}`}
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
                  [1, 3, 9, 10, 11].includes(attribute.value) && (
                    <Tooltip
                      title={`${attribute.name}: ${
                        ATTRIBUTES[attribute.value - 1].definition
                      }`}
                      key={attribute._id}
                    >
                      <Chip
                        size="small"
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
            label={`My Favorites (${props.fav_message_tasks?.length || 0})`}
            {...a11yProps(2)}
          />
          <Tab
            label={`FOLLOW UP (${props.followup_tasks?.length || 0})`}
            {...a11yProps(3)}
          />
          <Tab
            label={`NO ACTION (${props.pending_progress_tasks?.length || 0})`}
            {...a11yProps(4)}
          />
          <Tab
            label={`CLOSED (${props.closed_tasks?.length || 0})`}
            {...a11yProps(5)}
          />
          <Tab
            label={`All (${props.all_active_message_tasks?.length || 0})`}
            {...a11yProps(6)}
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
        <MuiDataGrid
          rows={props.no_essay_writer_tasks}
          columns={memoizedColumns}
          columnVisibilityModel={{
            number_input_from_editors: false,
            number_input_from_student: false
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Banner
          ReadOnlyMode={true}
          bg={'danger'}
          title={'warning'}
          path={'/'}
          text={'Follow up'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <MuiDataGrid
          rows={props.new_message_tasks}
          columns={memoizedColumns}
          columnVisibilityModel={{
            number_input_from_editors: false,
            number_input_from_student: false
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Banner
          ReadOnlyMode={true}
          bg={'primary'}
          title={'info'}
          path={'/'}
          text={'My Favorite'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <MuiDataGrid
          rows={props.fav_message_tasks}
          columns={memoizedColumns}
          columnVisibilityModel={{
            number_input_from_editors: false,
            number_input_from_student: false
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
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
        <MuiDataGrid
          rows={props.followup_tasks}
          columns={memoizedColumns}
          columnVisibilityModel={{
            number_input_from_editors: false,
            number_input_from_student: false
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
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
          columnVisibilityModel={{
            number_input_from_editors: false,
            number_input_from_student: false
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
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
        <MuiDataGrid
          rows={props.closed_tasks}
          columns={memoizedColumns}
          columnVisibilityModel={{
            number_input_from_editors: false,
            number_input_from_student: false
          }}
        />
        <Typography variant="body2">
          {t(
            'Note: if the documents are not closed but locate here, it is because the applications are already submitted. The documents can safely closed eventually.',
            { ns: 'cvmlrl' }
          )}
        </Typography>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={6}>
        <Banner
          ReadOnlyMode={true}
          bg={'info'}
          title={'info'}
          path={'/'}
          text={'All Essays'}
          link_name={''}
          removeBanner={<></>}
          notification_key={undefined}
        />
        <MuiDataGrid
          rows={props.all_active_message_tasks}
          columns={memoizedColumns}
          columnVisibilityModel={{
            number_input_from_editors: false,
            number_input_from_student: false
          }}
        />
      </CustomTabPanel>
    </>
  );
}

export default EssayOverview;
