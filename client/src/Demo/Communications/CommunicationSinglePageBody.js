import React, { useEffect, useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import LaunchIcon from '@mui/icons-material/Launch';
import {
    Box,
    Card,
    Button,
    Link,
    Grid,
    Typography,
    List,
    ListItem,
    Breadcrumbs
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_Student, is_TaiGer_role } from '@taiger-common/core';

import MessageList from './MessageList';
import CommunicationThreadEditor from './CommunicationThreadEditor';
import { TabTitle } from '../Utils/TabTitle';
import DEMO from '../../store/constant';
import { appConfig } from '../../config';
import { useAuth } from '../../components/AuthProvider';
import { TopBar } from '../../components/TopBar/TopBar';
import useCommunications from '../../hooks/useCommunications';

function CommunicationSinglePageBody({ loadedData }) {
    const { data, student } = loadedData;
    const { user } = useAuth();
    const { t } = useTranslation();
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

    const [windowInnerWidth, setWindowInnerWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowInnerWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [windowInnerWidth]);

    const student_name = `${student.firstname} ${student.lastname}`;
    // const template_input = JSON.parse(
    //   `{"time":1689452160435,"blocks":[{"id":"WHsFbpmWmH","type":"paragraph","data":{"text":"<b>我的問題：</b>"}},{"id":"F8K_f07R8l","type":"paragraph","data":{"text":"&lt;Example&gt; 我想選課，不知道下學期要選什麼"}},{"id":"yYUL0bYWSB","type":"paragraph","data":{"text":"<b>我想和顧問討論</b>："}},{"id":"wJu56jmAKC","type":"paragraph","data":{"text":"&lt;Example&gt; 課程符合度最佳化"}}],"version":"2.27.2"}`
    // );
    TabTitle(`Chat: ${student_name}`);

    return (
        <Box>
            {student?.archiv && <TopBar />}
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <Link
                                underline="hover"
                                color="inherit"
                                component={LinkDom}
                                to={`${DEMO.DASHBOARD_LINK}`}
                            >
                                {appConfig.companyName}
                            </Link>
                            {is_TaiGer_role(user) && (
                                <Link
                                    underline="hover"
                                    color="inherit"
                                    component={LinkDom}
                                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                        student._id.toString(),
                                        DEMO.PROFILE_HASH
                                    )}`}
                                >
                                    {student_name}
                                </Link>
                            )}
                            <Typography color="text.primary">
                                {t('Message', { ns: 'common' })}
                            </Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <Typography variant="h6">
                            {t('Instructions')}:
                        </Typography>
                        <Box variant="body1">
                            {appConfig.companyName}
                            顧問皆位於中歐時區，無法及時回復，為確保有
                            <b>效率溝通</b>，留言時請注意以下幾點：
                            <List>
                                <ListItem>
                                    <Typography sx={{ display: 'flex' }}>
                                        1. 請把
                                        <Link
                                            to={
                                                is_TaiGer_Student(user)
                                                    ? `${DEMO.SURVEY_LINK}`
                                                    : `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                                          student._id?.toString(),
                                                          DEMO.SURVEY_HASH
                                                      )}`
                                            }
                                            component={LinkDom}
                                            target="_blank"
                                            sx={{ display: 'flex' }}
                                            fontWeight="bold"
                                        >
                                            {t('Profile', { ns: 'common' })}{' '}
                                            <LaunchIcon fontSize="small" />
                                        </Link>
                                        填好，
                                        <Link
                                            to={
                                                is_TaiGer_Student(user)
                                                    ? `${DEMO.BASE_DOCUMENTS_LINK}`
                                                    : `${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                                          student._id?.toString(),
                                                          DEMO.PROFILE_HASH
                                                      )}`
                                            }
                                            component={LinkDom}
                                            target="_blank"
                                            fontWeight="bold"
                                            sx={{ display: 'flex' }}
                                        >
                                            {t('My Documents', {
                                                ns: 'common'
                                            })}{' '}
                                            <LaunchIcon fontSize="small" />
                                        </Link>
                                        ，文件有的都盡量先掃描上傳，
                                        <Link
                                            to={`${DEMO.COURSES_LINK}/${student._id?.toString()}`}
                                            component={LinkDom}
                                            target="_blank"
                                            sx={{ display: 'flex' }}
                                            fontWeight="bold"
                                        >
                                            {t('My Courses', { ns: 'common' })}{' '}
                                            <LaunchIcon fontSize="small" />
                                        </Link>
                                        課程填好，之後 Agent
                                        在回答問題時比較能掌握狀況。
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                    2.
                                    描述你的問題，請盡量一次列出所有問題，顧問可以一次回答。
                                </ListItem>
                                <ListItem>3. 你想要完成事項。</ListItem>
                                <ListItem>
                                    註：或想一次處理，請準備好所有問題，並和顧問約時間通話。
                                </ListItem>
                                <ListItem>
                                    {appConfig.companyName}{' '}
                                    顧問平時的工作時段位於美國或歐洲時區，因此可能無法立即回覆您的訊息，敬請諒解。依據您的問題複雜度，顧問將會在一至五個工作日內回覆您。因此，請在訊息來往時保持有效率的溝通，以確保迅速解決問題。
                                    顧問隨時需要了解您的進展情況，為了避免不必要的來回詢問學生資料進度，為此，請務必將您在TaiGer
                                    Portal平台上的個人資訊保持最新，以確保訊息的準確性。
                                </ListItem>
                            </List>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Typography fontWeight="bold">
                            {t('Agents', { ns: 'common' })}:
                        </Typography>
                        {student?.agents?.map((agent, i) => (
                            <Typography key={i}>
                                <Link
                                    to={`${DEMO.TEAM_AGENT_PROFILE_LINK(agent._id.toString())}`}
                                    component={LinkDom}
                                >{`${agent.firstname} ${agent.lastname}`}</Link>
                            </Typography>
                        ))}
                    </Grid>
                </Grid>
            </>
            <Button
                fullWidth
                color="secondary"
                variant="outlined"
                onClick={handleLoadMessages}
                disabled={loadButtonDisabled}
                sx={{ mb: 2 }}
            >
                {t('Load')}
            </Button>
            <Box>
                {upperThread.length > 0 && (
                    <MessageList
                        accordionKeys={uppderaccordionKeys}
                        student_id={student._id.toString()}
                        isUpperMessagList={true}
                        thread={upperThread}
                        isLoaded={isLoaded}
                        user={user}
                        onDeleteSingleMessage={onDeleteSingleMessage}
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
                />
            </Box>
            {student.archiv !== true ? (
                <Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    padding: 2,
                                    maxWidth: window.innerWidth - 64,
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
                                    handleClickSave={handleClickSave}
                                />
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            ) : (
                <Card>
                    {t('The service is finished. Therefore, it is readonly.')}
                </Card>
            )}
        </Box>
    );
}

export default CommunicationSinglePageBody;
