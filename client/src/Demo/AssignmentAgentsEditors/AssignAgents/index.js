import React from 'react';
import { Navigate, useLoaderData } from 'react-router-dom';
import { Box } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import AssignAgentsPage from './AssignAgentsPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import DEMO from '../../../store/constant';
import { useAuth } from '../../../components/AuthProvider';
import useStudents from '../../../hooks/useStudents';

const AssignAgents = () => {
    const { user } = useAuth();
    const {
        data: { data: fetchedStudents }
    } = useLoaderData();

    const {
        students,
        res_modal_message,
        res_modal_status,
        submitUpdateAgentlist,
        ConfirmError
    } = useStudents({
        students: fetchedStudents
    });

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }

    return (
        <Box data-testid="assignment_agents">
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
            <AssignAgentsPage
                students={students}
                submitUpdateAgentlist={submitUpdateAgentlist}
            />
        </Box>
    );
};

export default AssignAgents;
