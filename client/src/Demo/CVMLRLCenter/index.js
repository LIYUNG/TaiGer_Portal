import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Card,
    Breadcrumbs,
    Button,
    Link,
    Typography
} from '@mui/material';
import { is_TaiGer_Editor, is_TaiGer_role } from '@taiger-common/core';

import CVMLRLOverview from './CVMLRLOverview';
import ErrorPage from '../Utils/ErrorPage';
import {
    getAllActiveEssays,
    getCVMLRLOverview,
    putThreadFavorite
} from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import {
    AGENT_SUPPORT_DOCUMENTS_A,
    FILE_TYPE_E,
    open_essays_tasks,
    open_tasks,
    toogleItemInArray
} from '../Utils/checking-functions';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import {
    is_my_fav_message_status,
    is_new_message_status,
    is_pending_status
} from '../../utils/contants';

const CVMLRLCenter = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [indexState, setIndexState] = useState({
        error: '',
        isLoaded: false,
        isLoaded2: false,
        data: null,
        success: false,
        students: null,
        essays: null,
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

    useEffect(() => {
        getCVMLRLOverview().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setIndexState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        students: data,
                        open_tasks_without_essays_arr: open_tasks(data).filter(
                            (open_task) =>
                                ![FILE_TYPE_E.essay_required].includes(
                                    open_task.file_type
                                )
                        ),
                        success: success,
                        res_status: status
                    }));
                } else {
                    setIndexState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setIndexState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, []);
    useEffect(() => {
        getAllActiveEssays().then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setIndexState((prevState) => ({
                        ...prevState,
                        isLoaded2: true,
                        essays: open_essays_tasks(data, user),
                        success: success,
                        res_status: status
                    }));
                } else {
                    setIndexState((prevState) => ({
                        ...prevState,
                        isLoaded2: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setIndexState((prevState) => ({
                    ...prevState,
                    isLoaded2: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, []);

    const {
        res_status,
        isLoaded,
        isLoaded2,
        essays,
        open_tasks_without_essays_arr
    } = indexState;
    TabTitle('CV ML RL Overview');
    if ((!isLoaded && !indexState.students) || (!isLoaded2 && !essays)) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    const handleFavoriteToggle = (id) => {
        const updatedEssays = indexState.essays?.map((row) =>
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
        const updatedOpenTasksWithoutEssaysArr =
            indexState.open_tasks_without_essays_arr?.map((row) =>
                row.id === id
                    ? {
                          ...row,
                          flag_by_user_id: row.flag_by_user_id?.includes(
                              user._id.toString()
                          )
                              ? row.flag_by_user_id?.filter(
                                    (userId) => userId !== user._id.toString()
                                )
                              : row.flag_by_user_id?.length > 0
                                ? [...row.flag_by_user_id, user._id.toString()]
                                : [user._id.toString()]
                      }
                    : row
            );
        setIndexState((prevState) => ({
            ...prevState,
            essays: updatedEssays,
            open_tasks_without_essays_arr: updatedOpenTasksWithoutEssaysArr
        }));
        putThreadFavorite(id).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (!success) {
                    setIndexState((prevState) => ({
                        ...prevState,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setIndexState((prevState) => ({
                    ...prevState,
                    error,
                    res_status: 500
                }));
            }
        );
    };

    const open_tasks_arr = [...essays, ...open_tasks_without_essays_arr];
    const tasks_withMyEssay_arr = open_tasks_arr.filter((open_task) =>
        [...AGENT_SUPPORT_DOCUMENTS_A, FILE_TYPE_E.essay_required].includes(
            open_task.file_type
        ) && is_TaiGer_Editor(user)
            ? open_task.outsourced_user_id?.some(
                  (outsourcedUser) =>
                      outsourcedUser._id.toString() === user._id.toString()
              )
            : true
    );
    const open_tasks_withMyEssay_arr = tasks_withMyEssay_arr.filter(
        (open_task) => open_task.show && !open_task.isFinalVersion
    );
    const new_message_tasks = open_tasks_withMyEssay_arr.filter((open_task) =>
        is_new_message_status(user, open_task)
    );

    const fav_message_tasks = open_tasks_withMyEssay_arr.filter((open_task) =>
        is_my_fav_message_status(user, open_task)
    );

    const followup_tasks = open_tasks_withMyEssay_arr.filter(
        (open_task) =>
            is_pending_status(user, open_task) &&
            open_task.latest_message_left_by_id !== ''
    );

    const pending_progress_tasks = open_tasks_withMyEssay_arr.filter(
        (open_task) =>
            is_pending_status(user, open_task) &&
            open_task.latest_message_left_by_id === ''
    );

    const closed_tasks = tasks_withMyEssay_arr.filter(
        (open_task) => open_task.show && open_task.isFinalVersion
    );

    return (
        <Box data-testid="cvmlrlcenter_component">
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
            >
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
                        <Typography color="text.primary">
                            {t('My Students', { ns: 'common' })}
                        </Typography>
                    ) : null}
                    <Typography color="text.primary">
                        {t('CV/ML/RL Center', { ns: 'common' })}
                    </Typography>
                </Breadcrumbs>
                {is_TaiGer_role(user) ? (
                    <Button
                        color="primary"
                        component={LinkDom}
                        size="small"
                        to="/doc-communications/"
                        variant="contained"
                    >
                        {t('Switch View', { ns: 'common' })}
                    </Button>
                ) : null}
            </Box>
            {!is_TaiGer_role(user) ? (
                <Card sx={{ p: 2 }}>
                    <Typography variant="body1">Instructions</Typography>
                    若您為初次使用，可能無任何
                    Tasks。請聯絡您的顧問處理選校等，方能開始準備文件。
                    <br />
                    在此之前可以詳閱，了解之後與Editor之間的互動模式：
                    <Link
                        component={LinkDom}
                        target="_blank"
                        to={`${DEMO.CV_ML_RL_DOCS_LINK}`}
                    >
                        <b>{t('Click me')}</b>
                    </Link>
                </Card>
            ) : null}
            <CVMLRLOverview
                closed_tasks={closed_tasks}
                fav_message_tasks={fav_message_tasks}
                followup_tasks={followup_tasks}
                handleFavoriteToggle={handleFavoriteToggle}
                isLoaded={indexState.isLoaded}
                new_message_tasks={new_message_tasks}
                pending_progress_tasks={pending_progress_tasks}
                students={indexState.students}
                success={indexState.success}
            />
        </Box>
    );
};

export default CVMLRLCenter;
