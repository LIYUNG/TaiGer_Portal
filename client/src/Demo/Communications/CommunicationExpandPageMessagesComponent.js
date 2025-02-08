import React, { Fragment } from 'react';
import { Card, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MessageList from './MessageList';
import CommunicationThreadEditor from './CommunicationThreadEditor';
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
        isDeleting,
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

    const handleSave = (e, editorState) => {
        handleClickSave(e, editorState);
    };
    console.log('layer2');
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
                            isDeleting={isDeleting}
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
                        isDeleting={isDeleting}
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
                </Grid>
            </Grid>
        </Fragment>
    );
}

export default CommunicationExpandPageMessagesComponent;
