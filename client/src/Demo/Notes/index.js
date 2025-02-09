import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import NotesCard from './NotesCard';
import ErrorPage from '../Utils/ErrorPage';
import { getStudentNotes } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import Loading from '../../components/Loading/Loading';

const Notes = (props) => {
    const { user } = useAuth();
    const [notesState, setNotesState] = useState({
        error: '',
        role: '',
        isLoaded: false,
        notes: '{}',
        success: false,
        updateconfirmed: false,
        res_status: 0
    });

    useEffect(() => {
        getStudentNotes(props.student_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                let initialEditorState = null;
                if (data?.notes !== '{}') {
                    try {
                        initialEditorState = JSON.parse(data.notes);
                    } catch (e) {
                        initialEditorState = { time: new Date(), blocks: [] };
                    }
                } else {
                    initialEditorState = { time: new Date(), blocks: [] };
                }
                if (success) {
                    setNotesState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        notes: initialEditorState,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setNotesState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setNotesState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, [props.student_id]);

    if (!is_TaiGer_role(user)) {
        return <Navigate to={`${DEMO.DASHBOARD_LINK}`} />;
    }
    TabTitle('Academic Background Survey');
    const { res_status, isLoaded } = notesState;

    if (!isLoaded) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }
    return (
        <Box>
            <NotesCard
                isLoaded={notesState.isLoaded}
                notes={notesState.notes}
                student_id={props.student_id}
                user={user}
            />
        </Box>
    );
};

export default Notes;
