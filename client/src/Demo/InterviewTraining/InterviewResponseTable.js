import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { Box, Button, Breadcrumbs, Link, Typography } from '@mui/material';

import { isProgramDecided, is_TaiGer_role } from '../Utils/checking-functions';
import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getMyInterviews, getAllInterviews } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { MuiDataGrid } from '../../components/MuiDataGrid';
import { convertDate, showTimezoneOffset } from '../Utils/contants';

function InterviewResponseTable() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [interviewTrainingState, setInterviewResponseTableState] = useState({
    error: '',
    isLoaded: false,
    data: null,
    success: false,
    interviewslist: [],
    interview_id_toBeDelete: '',
    interview_name_toBeDelete: '',
    program_id: '',
    interviewData: {},
    category: '',
    SetDeleteDocModel: false,
    available_interview_request_programs: [],
    isAdd: false,
    expand: true,
    editorState: '',
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    if (is_TaiGer_role(user)) {
      getAllInterviews().then(
        (resp) => {
          const { data, success, student } = resp.data;
          const { status } = resp;
          if (success) {
            setInterviewResponseTableState((prevState) => ({
              ...prevState,
              isLoaded: true,
              interviewslist: data,
              student: student,
              success: success,
              res_status: status
            }));
          } else {
            setInterviewResponseTableState((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_status: status
            }));
          }
        },
        (error) => {
          setInterviewResponseTableState((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    } else {
      getMyInterviews().then(
        (resp) => {
          const { data, success, student } = resp.data;
          const { status } = resp;
          if (success) {
            setInterviewResponseTableState((prevState) => ({
              ...prevState,
              isLoaded: true,
              interviewslist: data,
              student: student,
              available_interview_request_programs:
                student?.applications
                  ?.filter(
                    (application) =>
                      isProgramDecided(application) &&
                      application.admission !== 'O' &&
                      application.admission !== 'X' &&
                      !interviewslist.find(
                        (interview) =>
                          interview.program_id._id.toString() ===
                          application.programId._id.toString()
                      )
                  )
                  .map((application) => {
                    return {
                      key: application.programId._id.toString(),
                      value: `${application.programId.school} ${application.programId.program_name} ${application.programId.degree} ${application.programId.semester}`
                    };
                  }) || [],
              success: success,
              res_status: status
            }));
          } else {
            setInterviewResponseTableState((prevState) => ({
              ...prevState,
              isLoaded: true,
              res_status: status
            }));
          }
        },
        (error) => {
          setInterviewResponseTableState((prevState) => ({
            ...prevState,
            isLoaded: true,
            error,
            res_status: 500
          }));
        }
      );
    }
  }, []);

  const handleClick = () => {
    navigate(`${DEMO.INTERVIEW_ADD_LINK}`);
  };

  const ConfirmError = () => {
    setInterviewResponseTableState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  TabTitle('Interview training');
  const column = [
    {
      field: 'status',
      headerName: 'Status',
      align: 'left',
      headerAlign: 'left',
      width: 100
    },
    {
      field: 'firstname_lastname',
      headerName: 'First-/ Last Name',
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
      field: 'trainer_id',
      headerName: `Trainer`,
      align: 'left',
      headerAlign: 'left',
      minWidth: 100,
      renderCell: (params) => {
        return params.row.trainer_id?.map((trainer) => trainer.firstname) || [];
      }
    },
    {
      field: 'event_id',
      headerName: `${t('Training Time', { ns: 'interviews' })} (${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      } ${showTimezoneOffset()})`,
      align: 'left',
      headerAlign: 'left',
      width: 250,
      renderCell: (params) => {
        return (
          params.row.event_id && `${convertDate(params.row.event_id.start)}`
        );
      }
    },
    {
      field: 'interview_date',
      headerName: t('Interview Time'),
      align: 'left',
      headerAlign: 'left',
      width: 100,
      renderCell: (params) => {
        return (
          params.row.interview_date &&
          `${convertDate(params.row.interview_date)}`
        );
      }
    },
    {
      field: 'program_name',
      headerName: 'Interview',
      align: 'left',
      headerAlign: 'left',
      width: 400,
      renderCell: (params) => {
        return (
          <Link
            underline="hover"
            to={DEMO.INTERVIEW_SINGLE_LINK(params.row.id)}
            component={LinkDom}
            target="_blank"
            title={params.row.program_name}
          >
            {params.row.program_name}
          </Link>
        );
      }
    }
  ];
  const transform = (interviews) => {
    const result = [];
    if (!interviews) {
      return [];
    }
    for (const interview of interviews) {
      result.push({
        ...interview,
        id: `${interview._id}`,
        student_id: interview.student_id._id,
        trainer_id: interview.trainer_id,
        program_name: `${interview.program_id.school} ${interview.program_id.program_name} ${interview.program_id.degree} ${interview.program_id.semester}`,
        firstname_lastname: `${interview.student_id.firstname} ${interview.student_id.lastname}`
      });
    }
    return result;
  };
  const memoizedColumns = useMemo(() => column, [column]);

  const {
    res_status,
    isLoaded,
    res_modal_status,
    res_modal_message,
    interviewslist
  } = interviewTrainingState;

  if (!isLoaded) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  const rows = transform(interviewslist);

  return (
    <Box>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}

      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography color="text.primary">
          {is_TaiGer_role(user)
            ? t('All Interviews', { ns: 'interviews' })
            : t('My Interviews', { ns: 'interviews' })}
        </Typography>
      </Breadcrumbs>
      {!is_TaiGer_role(user) &&
        interviewTrainingState.available_interview_request_programs?.length >
          0 && (
          <Button
            fullWidth
            size="small"
            variant="contained"
            color="primary"
            onClick={handleClick}
            sx={{ my: 1 }}
          >
            {t('Add', { ns: 'common' })}
          </Button>
        )}
      {is_TaiGer_role(user) && (
        <Button
          fullWidth
          size="small"
          variant="contained"
          color="primary"
          onClick={handleClick}
          sx={{ my: 1 }}
        >
          {t('Add', { ns: 'common' })}
        </Button>
      )}
      <MuiDataGrid rows={rows} columns={memoizedColumns} />
    </Box>
  );
}

export default InterviewResponseTable;