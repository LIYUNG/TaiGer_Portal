import React from 'react';
import { Card, Button, Grid, useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import MessageList from './MessageList';
import CommunicationThreadEditor from './CommunicationThreadEditor';
import { useAuth } from '../../components/AuthProvider';
import useCommunications from '../../hooks/useCommunications';

const CommunicationExpandPageMessagesComponent = ({ data, student }) => {
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
        count,
        handleLoadMessages,
        onDeleteSingleMessage,
        onFileChange,
        handleClickSave
    } = useCommunications({ data, student });

    return (
        <Grid container>
            <Grid item xs={12}>
                <Button
                    color="secondary"
                    disabled={loadButtonDisabled}
                    fullWidth
                    onClick={handleLoadMessages}
                    size="small"
                    sx={{ mb: 1 }}
                    variant="outlined"
                >
                    {t('Load')}
                </Button>
            </Grid>
            <Grid item xs={12}>
                {upperThread.length > 0 ? (
                    <MessageList
                        accordionKeys={uppderaccordionKeys}
                        isDeleting={isDeleting}
                        isTaiGerView={true}
                        isUpperMessagList={true}
                        onDeleteSingleMessage={onDeleteSingleMessage}
                        student_id={student._id.toString()}
                        thread={upperThread}
                        user={user}
                    />
                ) : null}
                <MessageList
                    accordionKeys={accordionKeys}
                    isDeleting={isDeleting}
                    isTaiGerView={true}
                    isUpperMessagList={false}
                    onDeleteSingleMessage={onDeleteSingleMessage}
                    student_id={student._id.toString()}
                    thread={thread}
                    user={user}
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
                            buttonDisabled={buttonDisabled}
                            checkResult={checkResult}
                            count={count}
                            editorState={editorState}
                            files={files}
                            handleClickSave={handleClickSave}
                            onFileChange={onFileChange}
                            thread={thread}
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
    );
};

export default CommunicationExpandPageMessagesComponent;
