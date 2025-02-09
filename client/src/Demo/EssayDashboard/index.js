import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role } from '@taiger-common/core';

import ErrorPage from '../Utils/ErrorPage';
import { getAllCVMLRLOverview, putThreadFavorite } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import {
    file_category_const,
    open_tasks,
    toogleItemInArray
} from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import EssayOverview from './EssayOverview';
import {
    is_my_fav_message_status,
    is_new_message_status,
    is_pending_status
} from '../../utils/contants';

const EssayDashboard = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [essayDashboardState, setEssayDashboardState] = useState({
        error: '',
        isLoaded: false,
        data: null,
        success: false,
        students: null,
        doc_thread_id: '',
        student_id: '',
        program_id: '',
        SetAsFinalFileModel: false,
        open_tasks_arr: null,
        isFinalVersion: false,
        status: '', //reject, accept... etc
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });

    useEffect(() => {
        getAllCVMLRLOverview().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setEssayDashboardState({
                        ...essayDashboardState,
                        isLoaded: true,
                        students: data,
                        open_tasks_arr: open_tasks(data).filter((open_task) =>
                            [file_category_const.essay_required].includes(
                                open_task.file_type
                            )
                        ),
                        success: success,
                        res_status: status
                    });
                } else {
                    setEssayDashboardState({
                        ...essayDashboardState,
                        isLoaded: true,
                        res_status: status
                    });
                }
            },
            (error) => {
                setEssayDashboardState({
                    ...essayDashboardState,
                    isLoaded: true,
                    error,
                    res_status: 500
                });
            }
        );
    }, []);

    const handleFavoriteToggle = (id) => {
        const updatedOpenTasksArr = essayDashboardState.open_tasks_arr?.map(
            (row) =>
                row.id === id
                    ? {
                          ...row,
                          flag_by_user_id: toogleItemInArray(
                              row.flag_by_user_id,
                              user._id.toString()
                          )
                      }
                    : row
        );
        setEssayDashboardState((prevState) => ({
            ...prevState,
            open_tasks_arr: updatedOpenTasksArr
        }));
        putThreadFavorite(id).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (!success) {
                    setEssayDashboardState((prevState) => ({
                        ...prevState,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setEssayDashboardState((prevState) => ({
                    ...prevState,
                    error,
                    res_status: 500
                }));
            }
        );
    };

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    const { res_status, isLoaded, open_tasks_arr } = essayDashboardState;
    TabTitle('Essay Dashboard');
    if (!isLoaded && (!essayDashboardState.students || !open_tasks_arr)) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    const open_tasks_withMyEssay_arr =
        essayDashboardState.open_tasks_arr?.filter(
            (open_task) => open_task.show && !open_task.isFinalVersion
        );
    const no_essay_writer_tasks = open_tasks_withMyEssay_arr?.filter(
        (open_task) =>
            open_task.outsourced_user_id === undefined ||
            open_task.outsourced_user_id.length === 0
    );

    const new_message_tasks = open_tasks_withMyEssay_arr?.filter((open_task) =>
        is_new_message_status(user, open_task)
    );

    const fav_message_tasks = open_tasks_withMyEssay_arr?.filter((open_task) =>
        is_my_fav_message_status(user, open_task)
    );

    const followup_tasks = open_tasks_withMyEssay_arr?.filter(
        (open_task) =>
            is_pending_status(user, open_task) &&
            open_task.latest_message_left_by_id !== ''
    );

    const pending_progress_tasks = open_tasks_withMyEssay_arr?.filter(
        (open_task) =>
            is_pending_status(user, open_task) &&
            open_task.latest_message_left_by_id === ''
    );

    const closed_tasks = essayDashboardState.open_tasks_arr?.filter(
        (open_task) => open_task.show && open_task.isFinalVersion
    );

    const all_active_message_tasks = essayDashboardState.open_tasks_arr?.filter(
        (open_task) => open_task.show
    );

    return (
        <Box>
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
                    {t('Essay Dashboard', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <EssayOverview
                all_active_message_tasks={all_active_message_tasks}
                closed_tasks={closed_tasks}
                fav_message_tasks={fav_message_tasks}
                followup_tasks={followup_tasks}
                handleFavoriteToggle={handleFavoriteToggle}
                isLoaded={essayDashboardState.isLoaded}
                new_message_tasks={new_message_tasks}
                no_essay_writer_tasks={no_essay_writer_tasks}
                pending_progress_tasks={pending_progress_tasks}
                students={essayDashboardState.students}
                success={essayDashboardState.success}
            />
        </Box>
    );
};

export default EssayDashboard;
