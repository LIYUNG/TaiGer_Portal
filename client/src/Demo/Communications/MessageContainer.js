import React, { useEffect, useState } from 'react';

import Message from './Message';
import { updateAMessageInCommunicationThreadV2 } from '../../api';
import MessageEdit from './MessageEdit';
import { useAuth } from '../../components/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../api/client';
import { useSnackBar } from '../../contexts/use-snack-bar';

const MessageContainer = (props) => {
    const { user } = useAuth();
    const { setMessage, setSeverity, setOpenSnackbar } = useSnackBar();

    const [messageContainerState, setMessageContainerState] = useState({
        error: '',
        isEdit: false,
        message: props.message,
        buttonDisabled: false,
        editorState: {},
        expand: true,
        deadline: '',
        accordionKeys: [0], // to expand all]
        res_status: 0,
        res_modal_status: 0,
        res_modal_message: ''
    });

    const { mutate, isPending } = useMutation({
        mutationFn: updateAMessageInCommunicationThreadV2,
        onError: (error) => {
            setSeverity('error');
            setMessage(error.message || 'An error occurred. Please try again.');
            setOpenSnackbar(true);
        },
        onSuccess: (data, variables) => {
            const { message } = variables; // Extract message_id
            queryClient.invalidateQueries({
                queryKey: ['communications', props.student_id]
            });
            setMessageContainerState((prevState) => ({
                ...prevState,
                editorState: JSON.parse(message),
                message: data.data,
                isEdit: false,
                buttonDisabled: false,
                accordionKeys: [
                    ...prevState.accordionKeys,
                    prevState.accordionKeys.length
                ]
            }));
        }
    });

    useEffect(() => {
        var initialEditorState = null;
        if (props.message.message && props.message.message !== '{}') {
            try {
                initialEditorState = JSON.parse(props.message.message);
            } catch (e) {
                initialEditorState = { time: new Date(), blocks: [] };
            }
        } else {
            initialEditorState = { time: new Date(), blocks: [] };
        }
        setMessageContainerState((prevState) => ({
            ...prevState,
            editorState: initialEditorState
        }));
    }, []);

    const updateMessage = (e, editorState, messageId) => {
        e.preventDefault();
        mutate({
            communication_id: props.student_id,
            communication_messageId: messageId,
            message: JSON.stringify(editorState)
        });
    };

    const onEditMode = () => {
        setMessageContainerState((prevState) => ({
            ...prevState,
            isEdit: true
        }));
    };

    const handleCancelEdit = () => {
        setMessageContainerState((prevState) => ({
            ...prevState,
            isEdit: false
        }));
    };
    let firstname = props.message.user_id
        ? props.message.user_id.firstname
        : 'Staff';
    let lastname = props.message.user_id
        ? props.message.user_id.lastname
        : 'TaiGer';
    const editable = props.message.user_id
        ? props.message.user_id._id.toString() === user._id.toString()
            ? true
            : false
        : false;
    const full_name = `${firstname} ${lastname}`;
    return messageContainerState.isEdit ? (
        <MessageEdit
            buttonDisabled={isPending}
            editable={editable}
            editorState={messageContainerState.editorState}
            full_name={full_name}
            handleCancelEdit={handleCancelEdit}
            handleClickSave={updateMessage}
            idx={props.idx}
            isDeleting={props.isDeleting}
            isTaiGerView={props.isTaiGerView}
            lastupdate={props.lastupdate}
            message={props.message}
            onDeleteSingleMessage={props.onDeleteSingleMessage}
            onTrashClick={props.onTrashClick}
        />
    ) : (
        <Message
            accordionKeys={props.accordionKeys}
            idx={props.idx}
            isDeleting={props.isDeleting}
            isTaiGerView={props.isTaiGerView}
            lastupdate={props.lastupdate}
            message={messageContainerState.message}
            onDeleteSingleMessage={props.onDeleteSingleMessage}
            onEditMode={onEditMode}
            onTrashClick={props.onTrashClick}
        />
    );
};

export default MessageContainer;
