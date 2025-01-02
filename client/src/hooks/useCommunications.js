import { useState } from 'react';
import { is_TaiGer_role } from '@taiger-common/core';

import { useAuth } from '../components/AuthProvider';
import { readDOCX, readPDF, readXLSX } from '../Demo/Utils/checking-functions';
import {
    deleteAMessageInCommunicationThread,
    loadCommunicationThread,
    postCommunicationThread
} from '../api';

function useCommunications({ data, student }) {
    const { user } = useAuth();
    const [checkResult, setCheckResult] = useState([]);
    const [communicationsState, setCommunicationsState] = useState({
        error: '',
        isLoaded: true,
        thread: data,
        upperThread: [],
        buttonDisabled: false,
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
                        isLoaded: true,
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
                        ...prevState,
                        isLoaded: true
                    }));
                }
            },
            (error) => {
                setCommunicationsState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error
                }));
            }
        );
    };

    const onDeleteSingleMessage = (e, message_id) => {
        e.preventDefault();
        setCommunicationsState((prevState) => ({
            ...prevState,
            isLoaded: false
        }));
        deleteAMessageInCommunicationThread(
            student._id?.toString(),
            message_id
        ).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    // TODO: remove that message
                    const new_messages = [...communicationsState.thread];
                    let idx = new_messages.findIndex(
                        (message) => message._id.toString() === message_id
                    );
                    if (idx !== -1) {
                        new_messages.splice(idx, 1);
                    }
                    const new_upper_messages = [
                        ...communicationsState.upperThread
                    ];
                    let idx2 = new_upper_messages.findIndex(
                        (message) => message._id.toString() === message_id
                    );
                    if (idx2 !== -1) {
                        new_upper_messages.splice(idx2, 1);
                    }
                    setCommunicationsState((prevState) => ({
                        ...prevState,
                        success,
                        isLoaded: true,
                        upperThread: new_upper_messages,
                        thread: new_messages,
                        buttonDisabled: false,
                        res_modal_status: status
                    }));
                } else {
                    // TODO: what if data is oversize? data type not match?
                    const { message } = resp.data;
                    setCommunicationsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        buttonDisabled: false,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setCommunicationsState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
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
        setCommunicationsState((prevState) => ({
            ...prevState,
            buttonDisabled: true
        }));
        var message = JSON.stringify(editorState);

        const formData = new FormData();

        if (communicationsState.files) {
            communicationsState.files.forEach((file) => {
                formData.append('files', file);
            });
        }

        formData.append('message', message);

        postCommunicationThread(
            communicationsState.student._id.toString(),
            formData
        ).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setCommunicationsState((prevState) => ({
                        ...prevState,
                        success,
                        editorState: {},
                        thread: [...communicationsState.thread, ...data],
                        isLoaded: true,
                        files: [],
                        buttonDisabled: false,
                        accordionKeys: [
                            ...communicationsState.accordionKeys,
                            communicationsState.accordionKeys.length
                        ],
                        res_modal_status: status
                    }));
                } else {
                    // TODO: what if data is oversize? data type not match?
                    const { message } = resp.data;
                    setCommunicationsState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        buttonDisabled: false,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setCommunicationsState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: error
                }));
            }
        );
    };

    return {
        buttonDisabled: communicationsState.buttonDisabled,
        loadButtonDisabled: communicationsState.loadButtonDisabled,
        isLoaded: communicationsState.isLoaded,
        files: communicationsState.files,
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
