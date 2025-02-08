import { useEffect, useState } from 'react';
import { is_TaiGer_role } from '@taiger-common/core';

import { useAuth } from '../components/AuthProvider';
import { readDOCX, readPDF, readXLSX } from '../Demo/Utils/checking-functions';
import {
    deleteAMessageInCommunicationThreadV2,
    loadCommunicationThread,
    postCommunicationThreadV2
} from '../api';
import { useSnackBar } from '../contexts/use-snack-bar';
import { queryClient } from '../api/client';
import { useMutation } from '@tanstack/react-query';

function useCommunications({ data, student }) {
    const { user } = useAuth();
    const [checkResult, setCheckResult] = useState([]);
    const [communicationsState, setCommunicationsState] = useState({
        error: '',
        thread: data,
        count: 0,
        upperThread: [],
        editorState: {},
        files: [],
        student,
        pageNumber: 1,
        uppderaccordionKeys: [], // to expand all]
        accordionKeys: new Array(data.length)
            .fill()
            .map((x, i) => (i >= data.length - 2 ? i : -1)), // only expand latest 2
        loadButtonDisabled: false,
        res_modal_status: 0,
        res_modal_message: ''
    });
    const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();

    const { mutate, isPending } = useMutation({
        mutationFn: postCommunicationThreadV2,
        onError: (error) => {
            setSeverity('error');
            setMessage(error.message || 'An error occurred. Please try again.');
            setOpenSnackbar(true);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [
                    'communications',
                    communicationsState.student._id.toString()
                ]
            });
            queryClient.invalidateQueries({
                queryKey: ['communications', 'my']
            });
            setCommunicationsState((prevState) => ({
                ...prevState,
                editorState: {},
                count: prevState.count + 1,
                thread: [...communicationsState.thread, ...data.data],
                files: [],
                accordionKeys: [
                    ...communicationsState.accordionKeys,
                    communicationsState.accordionKeys.length
                ]
            }));
        }
    });

    const { mutate: mutateDelete, isPending: isDeleting } = useMutation({
        mutationFn: deleteAMessageInCommunicationThreadV2,
        onError: (error) => {
            setSeverity('error');
            setMessage(error.message || 'An error occurred. Please try again.');
            setOpenSnackbar(true);
        },
        onSuccess: (data, variables) => {
            const { communication_messageId: message_id } = variables; // Extract message_id
            queryClient.invalidateQueries({
                queryKey: [
                    'communications',
                    communicationsState.student._id.toString()
                ]
            });
            queryClient.invalidateQueries({
                queryKey: ['communications', 'my']
            });
            // remove that message
            const new_messages = [...communicationsState.thread];
            let idx = new_messages.findIndex(
                (message) => message._id.toString() === message_id
            );
            if (idx !== -1) {
                new_messages.splice(idx, 1);
            }
            const new_upper_messages = [...communicationsState.upperThread];
            let idx2 = new_upper_messages.findIndex(
                (message) => message._id.toString() === message_id
            );
            if (idx2 !== -1) {
                new_upper_messages.splice(idx2, 1);
            }
            setCommunicationsState((prevState) => ({
                ...prevState,
                // success,
                upperThread: new_upper_messages,
                thread: new_messages,
                buttonDisabled: false,
                res_modal_status: status
            }));
            setSeverity('success');
            setMessage('Delete the message successfully');
            setOpenSnackbar(true);
        }
    });

    useEffect(() => {
        setCommunicationsState((prevState) => ({
            ...prevState,
            upperThread: [],
            editorState: {},
            files: [],
            student,
            thread: data,
            pageNumber: 1,
            accordionKeys: new Array(data.length)
                .fill()
                .map((x, i) => (i >= data.length - 2 ? i : -1)), // only expand latest 2
            loadButtonDisabled: false
        }));
    }, [data]);

    const handleLoadMessages = () => {
        setCommunicationsState((prevState) => ({
            ...prevState,
            loadButtonDisabled: true
        }));
        loadCommunicationThread(
            student._id?.toString(),
            communicationsState.pageNumber + 1
        ).then(
            (resp) => {
                const { success, data, student } = resp.data;
                if (success) {
                    setCommunicationsState((prevState) => ({
                        ...prevState,
                        success,
                        upperThread: [
                            ...data,
                            ...communicationsState.upperThread
                        ],
                        student,
                        pageNumber: communicationsState.pageNumber + 1,
                        uppderaccordionKeys: [
                            ...new Array(
                                communicationsState.uppderaccordionKeys.length
                            )
                                .fill()
                                .map((x, i) => i),
                            ...new Array(data.length)
                                .fill()
                                .map((x, i) =>
                                    communicationsState.uppderaccordionKeys !==
                                    -1
                                        ? i +
                                          communicationsState
                                              .uppderaccordionKeys.length
                                        : -1
                                )
                        ],
                        loadButtonDisabled: data.length === 0 ? true : false
                    }));
                } else {
                    setCommunicationsState((prevState) => ({
                        ...prevState
                    }));
                }
            },
            (error) => {
                setCommunicationsState((prevState) => ({
                    ...prevState,
                    error
                }));
            }
        );
    };

    const onDeleteSingleMessage = (e, message_id) => {
        e.preventDefault();
        mutateDelete({
            student_id: student._id?.toString(),
            communication_messageId: message_id
        });
    };

    const onFileChange = (e) => {
        e.preventDefault();
        const file_num = e.target.files.length;
        if (file_num <= 3) {
            if (!e.target.files) {
                return;
            }
            if (!is_TaiGer_role(user)) {
                setCommunicationsState((prevState) => ({
                    ...prevState,
                    files: Array.from(e.target.files)
                }));
                return;
            }
            // Ensure a file is selected
            // TODO: make array
            const checkPromises = Array.from(e.target.files).map((file) => {
                const extension = file.name.split('.').pop().toLowerCase();
                const studentName = communicationsState.student?.firstname;

                if (extension === 'pdf') {
                    return readPDF(file, studentName);
                } else if (extension === 'docx') {
                    return readDOCX(file, studentName);
                } else if (extension === 'xlsx') {
                    return readXLSX(file, studentName);
                } else {
                    return Promise.resolve({});
                }
            });
            Promise.all(checkPromises)
                .then((results) => {
                    setCheckResult(results);
                    setCommunicationsState((prevState) => ({
                        ...prevState,
                        files: Array.from(e.target.files)
                    }));
                })
                .catch((error) => {
                    setCommunicationsState((prevState) => ({
                        ...prevState,
                        res_modal_message: error,
                        res_modal_status: 500
                    }));
                });
        } else {
            setCommunicationsState((prevState) => ({
                ...prevState,
                res_modal_message: 'You can only select up to 3 files.',
                res_modal_status: 423
            }));
        }
    };

    const handleClickSave = (e, editorState) => {
        e.preventDefault();
        var message = JSON.stringify(editorState);

        const formData = new FormData();

        if (communicationsState.files) {
            communicationsState.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        formData.append('message', message);
        mutate({
            studentId: communicationsState.student._id.toString(),
            formData
        });
    };

    return {
        buttonDisabled: isPending,
        loadButtonDisabled: communicationsState.loadButtonDisabled,
        isDeleting: isDeleting,
        files: communicationsState.files,
        count: communicationsState.count,
        editorState: communicationsState.editorState,
        checkResult,
        accordionKeys: communicationsState.accordionKeys,
        uppderaccordionKeys: communicationsState.uppderaccordionKeys,
        upperThread: communicationsState.upperThread,
        thread: communicationsState.thread,
        handleLoadMessages,
        onDeleteSingleMessage,
        onFileChange,
        handleClickSave
    };
}

export default useCommunications;
