import React, { Fragment } from 'react';
import { Navigate, Link as LinkDom } from 'react-router-dom';
import { Breadcrumbs, Link, Typography, Card } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import { is_TaiGer_Student } from '@taiger-common/core';
import i18next from 'i18next';
import { useQuery } from '@tanstack/react-query';

import UniAssistListCard from './UniAssistListCard';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { check_student_needs_uni_assist } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';
import { appConfig } from '../../config';
import Loading from '../../components/Loading/Loading';
import { getStudentUniAssistQuery } from '../../api/query';

const UniAssistList = () => {
    const { user } = useAuth();
    const { data, isLoading } = useQuery(
        getStudentUniAssistQuery({ studentId: user._id.toString() })
    );

    if (!is_TaiGer_Student(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('Uni-Assist & VPD');

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
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
                    Uni-Assist Tasks & VPD
                </Typography>
            </Breadcrumbs>
            {check_student_needs_uni_assist(data.data) ? (
                <>
                    <Typography sx={{ my: 2 }}>
                        {i18next.t(
                            'Instructions: Follow the documentations in'
                        )}
                        :{` `}
                        <Link
                            component={LinkDom}
                            target="_blank"
                            to={`${DEMO.UNI_ASSIST_DOCS_LINK}`}
                            underline="hover"
                        >
                            Uni-Assist <LaunchIcon fontSize="small" />
                        </Link>
                    </Typography>
                    <UniAssistListCard student={data.data} />
                </>
            ) : (
                <Card>
                    <Typography>
                        {i18next.t(
                            'Based on the applications, Uni-Assist is NOT needed'
                        )}
                    </Typography>
                </Card>
            )}
        </>
    );
};
export default UniAssistList;
