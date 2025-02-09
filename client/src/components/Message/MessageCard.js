import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Box,
    Button,
    IconButton,
    Link,
    Typography,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FileIcon, defaultStyles } from 'react-file-icon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { is_TaiGer_Student } from '@taiger-common/core';
import i18next from 'i18next';

import { BASE_URL } from '../../../src/api/request';
import EditorSimple from '../EditorJs/EditorSimple';
import { stringAvatar, convertDate } from '../../utils/contants';
import { useAuth } from '../AuthProvider';
import Loading from '../Loading/Loading';
import { IgnoreMessageThread } from '../../../src/api/index';

const MessageCard = (props) => {
    const { user } = useAuth();
    const [messageState, setMessageState] = useState({
        editorState: null,
        ConvertedContent: '',
        message_id: '',
        isLoaded: false,
        deleteMessageModalShow: false,
        ignore_message:
            props.message.ignore_message === false ||
            props.message.ignore_message === undefined
                ? false
                : props.message.ignore_message
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
        setMessageState((prevState) => ({
            ...prevState,
            editorState: initialEditorState,
            ConvertedContent: initialEditorState,
            isLoaded: props.isLoaded,
            deleteMessageModalShow: false
        }));
    }, [props.message.message, props.isLoaded]);

    const onOpendeleteMessageModalShow = (e, message_id, createdAt) => {
        e.stopPropagation();
        setMessageState((prevState) => ({
            ...prevState,
            message_id,
            deleteMessageModalShow: true,
            createdAt
        }));
    };
    const onHidedeleteMessageModalShow = () => {
        setMessageState((prevState) => ({
            ...prevState,
            message_id: '',
            createdAt: '',
            deleteMessageModalShow: false
        }));
    };

    const onDeleteSingleMessage = (e) => {
        e.preventDefault();
        setMessageState((prevState) => ({
            ...prevState,
            deleteMessageModalShow: false
        }));
        props.onDeleteSingleMessage(e, messageState.message_id);
    };

    const handleCheckboxChange = async () => {
        const ignore_message = !messageState.ignore_message;
        setMessageState((prevState) => {
            console.log('Previous ignored_message:', prevState.ignore_message);
            return {
                ...prevState,
                ignore_message: ignore_message
            };
        });
        const documentThreadId = props.documentsthreadId;
        const messageId = props.message._id;
        const message = props.message;
        const resp = await IgnoreMessageThread(
            documentThreadId,
            messageId,
            message.message,
            ignore_message
        );
        if (resp) {
            console.log('nice');
        }
    };

    if (!messageState.isLoaded && !messageState.editorState) {
        return <Loading />;
    }
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
    const apiFilePath = (apiPrefix, key_path) => {
        return `${BASE_URL}${apiPrefix}/${key_path}`;
    };
    const files_info = props.message.file.map((file, i) => (
        <Box key={i}>
            <span>
                {/* /api/document-threads/${studentId}/${documentsthreadId}/${file_key} */}
                <Link
                    component={LinkDom}
                    target="_blank"
                    to={apiFilePath(
                        props.apiPrefix,
                        file.path.replace(/\\/g, '/')
                    )}
                    underline="hover"
                >
                    <svg
                        fill="none"
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <FileIcon
                            extension={file.name.split('.').pop()}
                            {...defaultStyles[file.name.split('.').pop()]}
                        />
                    </svg>
                    {file.name}
                    <svg
                        fill="none"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="m7 10 4.86 4.86c.08.08.2.08.28 0L17 10"
                            stroke="#000"
                            strokeLinecap="round"
                            strokeWidth="2"
                        />
                    </svg>
                </Link>
            </span>
        </Box>
    ));

    return (
        <>
            <Accordion
                disableGutters
                expanded={props.accordionKeys[props.idx] === props.idx}
                sx={{
                    overflowWrap: 'break-word', // Add this line
                    maxWidth: window.innerWidth - 64,
                    marginTop: '1px',
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1
                    }
                }}
            >
                <AccordionSummary
                    aria-controls={'accordion' + props.idx}
                    expandIcon={<ExpandMoreIcon />}
                    id={`${props.idx}`}
                    onClick={() => props.singleExpandtHandler(props.idx)}
                >
                    <Avatar {...stringAvatar(full_name)} />
                    <Typography style={{ marginLeft: '10px', flex: 1 }}>
                        <b style={{ cursor: 'pointer' }}>{full_name}</b>
                    </Typography>
                    <Typography style={{ display: 'flex', float: 'right' }}>
                        {convertDate(props.message.createdAt)}
                        {editable ? (
                            <IconButton
                                onClick={(e) =>
                                    onOpendeleteMessageModalShow(
                                        e,
                                        props.message._id.toString(),
                                        props.message.createdAt
                                    )
                                }
                            >
                                <CloseIcon
                                    fontSize="small"
                                    style={{ cursor: 'pointer' }}
                                    title="Delete this message and file"
                                />
                            </IconButton>
                        ) : null}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails
                    in={props.accordionKeys[props.idx] === props.idx}
                >
                    <EditorSimple
                        defaultHeight={0}
                        editorState={messageState.editorState}
                        handleClickSave={props.handleClickSave}
                        holder={`${props.message._id.toString()}`}
                        imageEnable={true}
                        readOnly={true}
                    />
                    {files_info}
                    {!is_TaiGer_Student(user) &&
                    is_TaiGer_Student(props.message.user_id) ? (
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={messageState.ignore_message}
                                        onChange={handleCheckboxChange}
                                    />
                                }
                                label="no need to reply"
                                labelPlacement="start"
                            />
                        </FormGroup>
                    ) : null}
                </AccordionDetails>
            </Accordion>
            <Dialog
                aria-labelledby="contained-modal-title-vcenter"
                onClose={onHidedeleteMessageModalShow}
                open={messageState.deleteMessageModalShow}
            >
                <DialogTitle>
                    {i18next.t('Warning', { ns: 'common' })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you wan to delete this message on{' '}
                        <b>{convertDate(messageState.createdAt)}?</b>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        disabled={!props.isLoaded}
                        onClick={onDeleteSingleMessage}
                        variant="contained"
                    >
                        {props.isLoaded
                            ? i18next.t('Delete', { ns: 'common' })
                            : i18next.t('Pending', { ns: 'common' })}
                    </Button>
                    <Button
                        onClick={onHidedeleteMessageModalShow}
                        variant="outlined"
                    >
                        {i18next.t('Cancel', { ns: 'common' })}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default MessageCard;
