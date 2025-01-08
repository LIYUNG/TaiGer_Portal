import React, { Fragment, useState } from 'react';
import { Card, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MessageList from './MessageList';
import CommunicationThreadEditor from './CommunicationThreadEditor';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import { useAuth } from '../../components/AuthProvider';
import useCommunications from '../../hooks/useCommunications';

function CommunicationExpandPageMessagesComponent({ data, student }) {
    const { user } = useAuth();
    const { t } = useTranslation();
    const theme = useTheme();
    const ismobile = useMediaQuery(theme.breakpoints.down('md'));

    const {
        buttonDisabled,
        loadButtonDisabled,
        isLoaded,
        files,
        editorState,
        checkResult,
        accordionKeys,
        uppderaccordionKeys,
        upperThread,
        thread,
        handleLoadMessages,
        onDeleteSingleMessage,
        onFileChange,
        handleClickSave
    } = useCommunications({ data, student });

    const [
        communicationExpandPageComponentState,
        setCommunicationExpandPageMessagesComponentState
    ] = useState({
        error: '',
        messagesLoaded: false,
        thread: thread,
        count: 1,
        upperThread: [],
        buttonDisabled: false,
        editorState: {},
        files: [],
        student,
        expand: true,
        pageNumber: 1,
        uppderaccordionKeys: [], // to expand all]
        accordionKeys: [0], // to expand all]
        loadButtonDisabled: false,
        res_modal_status: 0,
        res_modal_message: ''
    });

    const handleSave = (e, editorState) => {
        handleClickSave(e, editorState);
    };

    const ConfirmError = () => {
        setCommunicationExpandPageMessagesComponentState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const { res_modal_status, res_modal_message } =
        communicationExpandPageComponentState;

    console.log('layer2')
    return (
        <Fragment>
            <Grid container>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        color="secondary"
                        variant="outlined"
                        onClick={handleLoadMessages}
                        disabled={loadButtonDisabled}
                        size="small"
                        sx={{ mb: 1 }}
                    >
                        {t('Load')}
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    {upperThread.length > 0 && (
                        <MessageList
                            accordionKeys={uppderaccordionKeys}
                            student_id={student._id.toString()}
                            isUpperMessagList={true}
                            thread={upperThread}
                            isLoaded={isLoaded}
                            user={user}
                            onDeleteSingleMessage={onDeleteSingleMessage}
                            isTaiGerView={true}
                        />
                    )}
                    <MessageList
                        accordionKeys={accordionKeys}
                        student_id={student._id.toString()}
                        isUpperMessagList={false}
                        thread={thread}
                        isLoaded={isLoaded}
                        user={user}
                        onDeleteSingleMessage={onDeleteSingleMessage}
                        isTaiGerView={true}
                    />
                    {student.archiv !== true ? (
                        <Card
                            sx={{
                                borderRadius: 2,
                                padding: 2,
                                ...(!ismobile && {
                                    width: '100%', // Make Drawer full width on small screens
                                    maxWidth: '100vw'
                                }),
                                pt: 2,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1
                                }
                            }}
                        >
                            <CommunicationThreadEditor
                                thread={thread}
                                buttonDisabled={buttonDisabled}
                                editorState={editorState}
                                files={files}
                                onFileChange={onFileChange}
                                checkResult={checkResult}
                                handleClickSave={handleSave}
                            />
                        </Card>
                    ) : (
                        <Card>
                            {t(
                                'The service is finished. Therefore, it is readonly.'
                            )}
                        </Card>
                    )}
                    {res_modal_status >= 400 && (
                        <ModalMain
                            ConfirmError={ConfirmError}
                            res_modal_status={res_modal_status}
                            res_modal_message={res_modal_message}
                        />
                    )}
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default CommunicationExpandPageMessagesComponent;
