import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Link,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DocumentStatusType, PROFILE_NAME } from '@taiger-common/core';

import { MuiDataGrid } from '../../components/MuiDataGrid';
import {
    FILE_DONT_CARE_SYMBOL,
    FILE_MISSING_SYMBOL,
    FILE_NOT_OK_SYMBOL,
    FILE_OK_SYMBOL,
    FILE_UPLOADED_SYMBOL
} from '../../utils/contants';
import { updateProfileDocumentStatus } from '../../api';
import DEMO from '../../store/constant';
import AcceptProfileFileModel from './AcceptedFilePreviewModal';

export const BaseDocumentsTable = ({ students }) => {
    const [baseDocumentsTableState, setBaseDocumentsTableState] = useState({
        students: students,
        isLoaded: true,
        rejectProfileFileModel: false,
        preview_path: '',
        doc_key: '',
        showPreview: false,
        acceptProfileFileModel: false,
        student_id: '',
        status: '', //reject, accept... etc
        category: '',
        feedback: ''
    });

    const { t } = useTranslation();

    const onUpdateProfileFilefromstudent = (e) => {
        e.preventDefault();
        setBaseDocumentsTableState((prevState) => ({
            ...prevState,
            isLoaded: false
        }));
        updateProfileDocumentStatus(
            baseDocumentsTableState.category,
            baseDocumentsTableState.student_id,
            baseDocumentsTableState.status,
            baseDocumentsTableState.feedback
        ).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    const students_temp = [...baseDocumentsTableState.students];
                    const student_index = students_temp.findIndex(
                        (student) =>
                            student._id === baseDocumentsTableState.student_id
                    );
                    const profile_idx = students_temp[
                        student_index
                    ].profile?.findIndex(
                        (p) => p.name === baseDocumentsTableState.category
                    );
                    students_temp[student_index].profile[profile_idx] = data;
                    setBaseDocumentsTableState((prevState) => ({
                        ...prevState,
                        students: students_temp,
                        success,
                        acceptProfileFileModel: false,
                        rejectProfileFileModel: false,
                        showPreview: false,
                        isLoaded: true,
                        res_modal_status: status
                    }));
                    setBaseDocumentsTableState((prevState) => ({
                        ...prevState
                    }));
                } else {
                    // TODO: redesign, modal ist better!
                    const { message } = resp.data;
                    setBaseDocumentsTableState((prevState) => ({
                        ...prevState,
                        showPreview: false,
                        acceptProfileFileModel: false,
                        rejectProfileFileModel: false,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                    setBaseDocumentsTableState((prevState) => ({
                        ...prevState
                    }));
                }
            },
            (error) => {
                setBaseDocumentsTableState((prevState) => ({
                    ...prevState,
                    isLoaded: {
                        ...prevState.isLoaded,
                        [baseDocumentsTableState.category]: true
                    },
                    error,
                    showPreview: false,
                    rejectProfileFileModel: false,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const closePreviewWindow = () => {
        setBaseDocumentsTableState((prevState) => ({
            ...prevState,
            showPreview: false
        }));
    };

    const closeRejectWarningWindow = () => {
        setBaseDocumentsTableState((prevState) => ({
            ...prevState,
            rejectProfileFileModel: false
        }));
    };

    const handleRejectMessage = (e, rejectmessage) => {
        e.preventDefault();
        setBaseDocumentsTableState((prevState) => ({
            ...prevState,
            feedback: rejectmessage
        }));
    };

    const showPreview = (e, path, doc_key, category, student_id) => {
        e.preventDefault();
        setBaseDocumentsTableState((prevState) => ({
            ...prevState,
            showPreview: true,
            preview_path: path,
            doc_key: doc_key,
            category,
            student_id
        }));
    };

    const onUpdateProfileDocStatus = (e, category, student_id, status) => {
        e.preventDefault();
        if (status === DocumentStatusType.Accepted) {
            setBaseDocumentsTableState((prevState) => ({
                ...prevState,
                student_id,
                category,
                status,
                acceptProfileFileModel: true
            }));
        } else {
            setBaseDocumentsTableState((prevState) => ({
                ...prevState,
                student_id,
                category,
                status,
                rejectProfileFileModel: true
            }));
        }
    };

    const baseDocumentTransformed = (students) => {
        return students.map((student) => ({
            id: student._id.toString(),
            studentName: `${student?.lastname_chinese || ''}${
                student?.firstname_chinese || ''
            } ${student.firstname} ${student.lastname}`,
            agents: student.agents,
            ...student.profile.reduce((acc, curr) => {
                acc[curr.name] = curr;
                return acc;
            }, {})
        }));
    };

    const student_profile_transformed = baseDocumentTransformed(
        baseDocumentsTableState.students
    );

    const profileArray = Object.entries(PROFILE_NAME).map(([key, value]) => [
        key,
        value
    ]);

    const baseDocumentColumnsWithoutName = profileArray.map((basdDoc) => {
        return {
            field: basdDoc[0],
            headerName: t(basdDoc[1], { ns: 'common' }),
            minWidth: 100,
            renderCell: (params) => {
                if (params.value?.status === DocumentStatusType.Uploaded) {
                    return (
                        <Link
                            component={LinkDom}
                            target="_blank"
                            title={params.value?.status}
                            to=""
                            underline="hover"
                        >
                            <IconButton>{FILE_UPLOADED_SYMBOL}</IconButton>
                            {`${params.value?.status || ''}`}
                        </Link>
                    );
                } else if (
                    params.value?.status === DocumentStatusType.Accepted
                ) {
                    let document_split = params.value?.path.replace(/\\/g, '/');
                    let document_name = document_split.split('/')[1];
                    return (
                        <Box
                            onClick={(e) => {
                                showPreview(
                                    e,
                                    document_name,
                                    params.value?.name,
                                    document_name,
                                    params.row.id
                                );
                            }}
                            style={{
                                textDecoration: 'none',
                                cursor: 'pointer',
                                display: 'flex'
                            }}
                        >
                            <IconButton>{FILE_OK_SYMBOL}</IconButton>{' '}
                            {`${params.value?.status || ''}`}
                        </Box>
                    );
                } else if (
                    params.value?.status === DocumentStatusType.Rejected
                ) {
                    return (
                        <>
                            <IconButton>{FILE_NOT_OK_SYMBOL}</IconButton>{' '}
                            {`${params.value?.status || ''}`}
                        </>
                    );
                } else if (
                    params.value?.status === DocumentStatusType.NotNeeded
                ) {
                    return (
                        <>
                            <IconButton>{FILE_DONT_CARE_SYMBOL}</IconButton>
                            {`${params.value?.status || ''}`}
                        </>
                    );
                } else {
                    return <IconButton>{FILE_MISSING_SYMBOL}</IconButton>;
                }
            }
        };
    });

    const baseDocumentColumns = [
        {
            field: 'studentName',
            headerName: t('First / Last Name', { ns: 'common' }),
            minWidth: 100,
            renderCell: (params) => {
                const linkUrl = `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                    params.row.id,
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
            field: 'agents',
            headerName: t('Agents', { ns: 'common' }),
            minWidth: 100,
            renderCell: (params) => {
                return params.value?.map((agent) => (
                    <Link
                        component={LinkDom}
                        key={`${agent._id.toString()}`}
                        target="_blank"
                        title={agent.firstname}
                        to={DEMO.TEAM_AGENT_LINK(agent._id.toString())}
                        underline="hover"
                    >
                        {`${agent.firstname} `}
                    </Link>
                ));
            }
        },
        ...baseDocumentColumnsWithoutName
    ];

    return (
        <Box>
            <MuiDataGrid
                columns={baseDocumentColumns}
                rows={student_profile_transformed}
            />
            <AcceptProfileFileModel
                closePreviewWindow={closePreviewWindow}
                isLoaded={baseDocumentsTableState.isLoaded}
                k={baseDocumentsTableState.doc_key}
                onUpdateProfileDocStatus={onUpdateProfileDocStatus}
                path={baseDocumentsTableState.preview_path}
                preview_path={baseDocumentsTableState.preview_path}
                showPreview={baseDocumentsTableState.showPreview}
                student_id={baseDocumentsTableState.student_id}
            />
            <Dialog
                aria-labelledby="contained-modal-title-vcenter"
                onClose={closeRejectWarningWindow}
                open={baseDocumentsTableState.rejectProfileFileModel}
            >
                <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please give a reason why the uploaded{' '}
                        {baseDocumentsTableState.category} is invalied?
                    </DialogContentText>
                    <TextField
                        onChange={(e) => handleRejectMessage(e, e.target.value)}
                        placeholder="ex. Poor scanned quality."
                        type="text"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={baseDocumentsTableState.feedback === ''}
                        onClick={(e) => onUpdateProfileFilefromstudent(e)}
                    >
                        {!baseDocumentsTableState.isLoaded ? (
                            <CircularProgress size={24} />
                        ) : (
                            t('Yes', { ns: 'common' })
                        )}
                    </Button>
                    <Button onClick={closeRejectWarningWindow}>
                        {t('No', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
