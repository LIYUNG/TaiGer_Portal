import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { Box, Button, Breadcrumbs, Link, Typography } from '@mui/material';
import {
    is_TaiGer_role,
    isProgramAdmitted,
    isProgramDecided,
    isProgramRejected
} from '@taiger-common/core';

import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { getMyInterviews, getAllInterviews } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { MuiDataGrid } from '../../components/MuiDataGrid';
import { convertDate, showTimezoneOffset } from '../../utils/contants';

const InterviewTraining = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [interviewTrainingState, setInterviewTrainingState] = useState({
        error: '',
        isLoaded: false,
        data: null,
        success: false,
        interviewslist: [],
        program_id: '',
        category: '',
        available_interview_request_programs: [],
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
                        setInterviewTrainingState((prevState) => ({
                            ...prevState,
                            isLoaded: true,
                            interviewslist: data,
                            student: student,
                            success: success,
                            res_status: status
                        }));
                    } else {
                        setInterviewTrainingState((prevState) => ({
                            ...prevState,
                            isLoaded: true,
                            res_status: status
                        }));
                    }
                },
                (error) => {
                    setInterviewTrainingState((prevState) => ({
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
                        setInterviewTrainingState((prevState) => ({
                            ...prevState,
                            isLoaded: true,
                            interviewslist: data,
                            student: student,
                            available_interview_request_programs:
                                student?.applications
                                    ?.filter(
                                        (application) =>
                                            isProgramDecided(application) &&
                                            !isProgramAdmitted(application) &&
                                            !isProgramRejected(application) &&
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
                        setInterviewTrainingState((prevState) => ({
                            ...prevState,
                            isLoaded: true,
                            res_status: status
                        }));
                    }
                },
                (error) => {
                    setInterviewTrainingState((prevState) => ({
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
        setInterviewTrainingState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    TabTitle('Interview training');
    const column = [
        {
            field: 'status',
            headerName: t('Status', { ns: 'common' }),
            align: 'left',
            headerAlign: 'left',
            width: 100
        },
        {
            field: 'firstname_lastname',
            headerName: t('First-/ Last Name', { ns: 'common' }),
            align: 'left',
            headerAlign: 'left',
            width: 200,
            renderCell: (params) => {
                const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    params.row.student_id,
                    DEMO.PROFILE_HASH
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
        {
            field: 'trainer_id',
            headerName: t('Trainer', { ns: 'common' }),
            align: 'left',
            headerAlign: 'left',
            minWidth: 100,
            renderCell: (params) => {
                return (
                    params.row.trainer_id?.map(
                        (trainer) => trainer.firstname
                    ) || []
                );
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
                    params.row.event_id &&
                    `${convertDate(params.row.event_id.start)}`
                );
            }
        },
        {
            field: 'interview_date',
            headerName: t('Interview Time', { ns: 'interviews' }),
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
            headerName: t('Interview', { ns: 'interviews' }),
            align: 'left',
            headerAlign: 'left',
            width: 400,
            renderCell: (params) => {
                return (
                    <Link
                        component={LinkDom}
                        target="_blank"
                        title={params.row.program_name}
                        to={DEMO.INTERVIEW_SINGLE_LINK(params.row.id)}
                        underline="hover"
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
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}

            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Typography color="text.primary">
                    {t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {t('Interview Center', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                sx={{ my: 1 }}
            >
                <Typography variant="h6">
                    {is_TaiGer_role(user)
                        ? t('All Interviews', { ns: 'interviews' })
                        : t('My Interviews', { ns: 'interviews' })}
                </Typography>
                {/* Button on the right */}
                <Box>
                    {!is_TaiGer_role(user) &&
                    interviewTrainingState.available_interview_request_programs
                        ?.length > 0 ? (
                        <Button
                            color="primary"
                            onClick={handleClick}
                            sx={{ my: 1 }}
                            variant="contained"
                        >
                            {t('Add', { ns: 'common' })}
                        </Button>
                    ) : null}
                    {is_TaiGer_role(user) ? (
                        <Button
                            color="primary"
                            onClick={handleClick}
                            sx={{ my: 1 }}
                            variant="contained"
                        >
                            {t('Add', { ns: 'common' })}
                        </Button>
                    ) : null}
                </Box>
            </Box>

            <MuiDataGrid columns={memoizedColumns} rows={rows} />
        </Box>
    );
};

export default InterviewTraining;
