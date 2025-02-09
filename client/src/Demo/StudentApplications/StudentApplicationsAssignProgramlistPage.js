import React, { useState } from 'react';
import {
    Box,
    Breadcrumbs,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Link,
    Typography
} from '@mui/material';

import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role, is_TaiGer_Student } from '@taiger-common/core';

import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import ProgramList from '../Program/ProgramList';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';
import { ImportStudentProgramsCard } from './ImportStudentProgramsCard';
import { StudentPreferenceCard } from './StudentPreferenceCard';

const StudentApplicationsAssignProgramlistPage = (props) => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [
        studentApplicationsAssignProgramlistState,
        setStudentApplicationsAssignProgramlistPageState
    ] = useState({
        error: '',
        student: props.student,
        applications: props.student.applications,
        isLoaded: props.isLoaded,
        program_ids: [],
        modalShowAssignSuccessWindow: false,
        student_id: null,
        success: false,
        showProgramCorrectnessReminderModal: true,
        res_status: 0,
        res_modal_status: 0,
        res_modal_message: ''
    });

    const onClickBackToApplicationOverviewnHandler = () => {
        navigate(
            `/student-applications/${studentApplicationsAssignProgramlistState.student._id.toString()}`
        );
    };

    const closeProgramCorrectnessModal = () => {
        setStudentApplicationsAssignProgramlistPageState((prevState) => ({
            ...prevState,
            showProgramCorrectnessReminderModal: false
        }));
    };
    const ConfirmError = () => {
        setStudentApplicationsAssignProgramlistPageState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const {
        res_status,
        isLoaded,
        res_modal_status,
        res_modal_message,
        showProgramCorrectnessReminderModal
    } = studentApplicationsAssignProgramlistState;

    if (!isLoaded && !studentApplicationsAssignProgramlistState.student) {
        return <Loading />;
    }
    TabTitle(
        `Student ${studentApplicationsAssignProgramlistState.student.firstname} ${studentApplicationsAssignProgramlistState.student.lastname} || Applications Status`
    );
    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    return (
        <Box>
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
            {is_TaiGer_Student(user) ? (
                <Dialog open={showProgramCorrectnessReminderModal}>
                    <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
                    <DialogContent>
                        <Typography
                            sx={{ mt: 2 }}
                            variant="body1"
                        >{`${appConfig.companyName} Portal 網站上的學程資訊主要為管理申請進度為主，學校學程詳細資訊仍以學校網站為主。`}</Typography>
                        <Typography
                            sx={{ mt: 2 }}
                        >{`若發現 ${appConfig.companyName} Portal 資訊和學校官方網站資料有不同之處，請和顧問討論。`}</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color="primary"
                            fullWidth
                            onClick={closeProgramCorrectnessModal}
                            sx={{ mt: 2 }}
                            variant="contained"
                        >
                            {t('Accept', { ns: 'common' })}
                        </Button>
                    </DialogActions>
                </Dialog>
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
                {is_TaiGer_role(user) ? (
                    <Link
                        color="inherit"
                        component={LinkDom}
                        to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                            props.student._id.toString(),
                            DEMO.PROFILE_HASH
                        )}`}
                        underline="hover"
                    >
                        {props.student.firstname} {props.student.lastname}
                    </Link>
                ) : null}
                <Typography color="text.primary">
                    {t('Applications')}
                </Typography>
            </Breadcrumbs>
            <Grid container spacing={2}>
                <Grid item md={is_TaiGer_role(user) ? 6 : 12} xs={12}>
                    <StudentPreferenceCard student={props.student} />
                </Grid>
                {is_TaiGer_role(user) ? (
                    <Grid item md={6} xs={12}>
                        <ImportStudentProgramsCard student={props.student} />
                    </Grid>
                ) : null}
            </Grid>
            <>
                <ProgramList
                    isStudentApplicationPage={true}
                    student={props.student}
                />
                <Button
                    color="secondary"
                    onClick={onClickBackToApplicationOverviewnHandler}
                    size="small"
                    variant="contained"
                >
                    {t('Back')}
                </Button>
            </>
        </Box>
    );
};

export default StudentApplicationsAssignProgramlistPage;
