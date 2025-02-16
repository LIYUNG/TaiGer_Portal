import React, { useEffect } from 'react';
import {
    Box,
    Typography,
    Link,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    Badge,
    TextField,
    Breadcrumbs
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as LinkDom, useParams } from 'react-router-dom';
import { is_TaiGer_role } from '@taiger-common/core';

import {
    getInterview,
    getInterviewSurvey,
    updateInterviewSurvey
} from '../../api';
import Loading from '../../components/Loading/Loading';
import ErrorPage from '../Utils/ErrorPage';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { useAuth } from '../../components/AuthProvider';
import { TopBar } from '../../components/TopBar/TopBar';
import { ConfirmationModal } from '../../components/Modal/ConfirmationModal';
const Questionnaire = () => {
    const { interview_id } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isChanged, setIsChanged] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [values, setValues] = React.useState({
        q1: '',
        q2: '',
        q3: '',
        interviewQuestions: '',
        interviewFeedback: ''
    });
    const [interview, setInterview] = React.useState({});
    const [interviewSurveyState, setInterviewSurveyState] = React.useState({
        isLoaded: false,
        res_status: 0
    });

    useEffect(() => {
        fetchInterviewAndSurvey();
        getInterview(interview_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setInterview(data);
                    setInterviewSurveyState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setInterviewSurveyState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setInterviewSurveyState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, [interview_id]);

    const fetchInterviewAndSurvey = async () => {
        try {
            const {
                data: { data, success }
            } = await getInterviewSurvey(interview_id);
            if (success) {
                const result = data?.responses?.reduce((acc, item) => {
                    acc[item.questionId] = item.answer;
                    return acc;
                }, {});
                setValues({
                    ...result,
                    isFinal: data?.isFinal,
                    interviewQuestions: data?.interviewQuestions,
                    interviewFeedback: data?.interviewFeedback
                });
            }
        } catch (error) {
            setInterviewSurveyState((prevState) => ({
                ...prevState,
                isLoaded: true,
                error,
                res_status: 500
            }));
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        // Enforce character limit for interviewQuestions
        if (
            (name === 'interviewQuestions' || name === 'interviewFeedback') &&
            value.length > 2000
        ) {
            return;
        }
        setIsChanged(true);
        setValues({
            ...values,
            [name]: value
        });
    };

    const handleSaveDraft = async () => {
        try {
            setIsChanged(false);
            const response = await updateInterviewSurvey(interview_id, {
                student_id: interview.student_id?._id?.toString(), // Replace with actual respondent ID if needed
                interview_id: interview_id,
                responses: [
                    { questionId: 'q1', answer: values.q1 },
                    { questionId: 'q2', answer: values.q2 },
                    { questionId: 'q3', answer: values.q3 }
                ],
                interviewQuestions: values.interviewQuestions,
                interviewFeedback: values.interviewFeedback
            });
            console.log('Survey response submitted:', response.data);
        } catch (error) {
            console.error('Error submitting survey response:', error);
        }
    };

    const formValidator = () => {
        if (
            !values.q1 ||
            !values.q2 ||
            !values.q3 ||
            !values.interviewQuestions ||
            !values.interviewFeedback
        ) {
            return false;
        }
        return true;
    };
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await updateInterviewSurvey(interview_id, {
                student_id: interview.student_id?._id?.toString(), // Replace with actual respondent ID if needed
                interview_id: interview_id,
                responses: [
                    { questionId: 'q1', answer: values.q1 },
                    { questionId: 'q2', answer: values.q2 },
                    { questionId: 'q3', answer: values.q3 }
                ],
                isFinal: true,
                interviewQuestions: values.interviewQuestions,
                interviewFeedback: values.interviewFeedback
            });
            setIsLoading(false);
            setIsModalOpen(false);
            setValues((prevState) => ({
                ...prevState,
                isFinal: true
            }));
            console.log('Survey response submitted:', response.data);
        } catch (error) {
            console.error('Error submitting survey response:', error);
        }
    };

    const { res_status, isLoaded } = interviewSurveyState;

    if (!isLoaded) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    const interview_name = `${interview?.student_id.firstname} ${interview?.student_id.lastname} - ${interview?.program_id.school} ${interview?.program_id.program_name} ${interview?.program_id.degree} ${interview?.program_id.semester}`;

    return (
        <Box>
            <Breadcrumbs aria-label="breadcrumb">
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DASHBOARD_LINK}`}
                    underline="hover"
                >
                    {appConfig.companyName}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.INTERVIEW_LINK}`}
                    underline="hover"
                >
                    {is_TaiGer_role(user)
                        ? t('All Interviews', { ns: 'interviews' })
                        : t('My Interviews', { ns: 'interviews' })}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.INTERVIEW_SINGLE_LINK(interview_id)}`}
                    underline="hover"
                >
                    {interview_name}
                </Link>
                <Typography color="text.primary">
                    {t('Survey', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            {values.isFinal ? <TopBar /> : null}
            <Box sx={{ mb: 1 }}>
                <Typography fontWeight="bold" variant="h6">
                    {t('Interview Training Survey', { ns: 'interviews' })}
                </Typography>
                <Typography variant="h6">{interview_name}</Typography>
                <Typography variant="h6">
                    {t(
                        'Kindly share your experience of our interview training by rating the following statements.',
                        { ns: 'interviews' }
                    )}
                </Typography>
                <Typography fontWeight="bold" sx={{ my: 1 }} variant="body2">
                    {t('1. not agree    5. strongly aggree', {
                        ns: 'interviews'
                    })}
                </Typography>
                <FormControl component="fieldset">
                    <FormLabel component="legend">
                        {t(
                            'The interview training materials provided beforehand were beneficial for my official interview.',
                            { ns: 'interviews' }
                        )}
                    </FormLabel>
                    <RadioGroup
                        aria-label="q1"
                        name="q1"
                        onChange={handleChange}
                        row
                        value={values.q1}
                    >
                        {[1, 2, 3, 4, 5].map((value) => (
                            <FormControlLabel
                                control={<Radio />}
                                disabled={values.isFinal}
                                key={value}
                                label={String(value)}
                                labelPlacement="top"
                                value={String(value)}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
            <Box sx={{ mb: 1 }}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">
                        {t(
                            'The interview training significantly helped me to conduct the official interview.',
                            { ns: 'interviews' }
                        )}
                    </FormLabel>
                    <RadioGroup
                        aria-label="q2"
                        name="q2"
                        onChange={handleChange}
                        row
                        value={values.q2}
                    >
                        {[1, 2, 3, 4, 5].map((value) => (
                            <FormControlLabel
                                control={<Radio />}
                                disabled={values.isFinal}
                                key={value}
                                label={String(value)}
                                labelPlacement="top"
                                value={String(value)}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
            <Box sx={{ mb: 1 }}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">
                        {t(
                            'The interview trainer was friendly and helped me feel less nervous.',
                            { ns: 'interviews' }
                        )}
                    </FormLabel>
                    <RadioGroup
                        aria-label="q3"
                        name="q3"
                        onChange={handleChange}
                        row
                        value={values.q3}
                    >
                        {[1, 2, 3, 4, 5].map((value) => (
                            <FormControlLabel
                                control={<Radio />}
                                disabled={values.isFinal}
                                key={value}
                                label={String(value)}
                                labelPlacement="top"
                                value={String(value)}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
            <Box sx={{ mb: 1 }}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <FormLabel component="legend">
                        {t(
                            `Please provide the interview questions to {{brandName}}`,
                            {
                                ns: 'interviews',
                                brandName: appConfig.companyName
                            }
                        )}
                    </FormLabel>
                    <TextField
                        InputProps={{
                            readOnly: values.isFinal
                        }}
                        fullWidth
                        maxLength={2000}
                        multiline
                        name="interviewQuestions"
                        onChange={handleChange}
                        placeholder="example questions"
                        rows="10"
                        type="textarea"
                        value={values.interviewQuestions}
                    />
                    <Badge bg={`${'primary'}`}>
                        {values.interviewQuestions?.length || 0}/{2000}
                    </Badge>
                </FormControl>
            </Box>
            <Box sx={{ mb: 1 }}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <FormLabel component="legend">
                        {t(
                            `Please provide the interview training feedback to {{brandName}}`,
                            {
                                ns: 'interviews',
                                brandName: appConfig.companyName
                            }
                        )}
                    </FormLabel>
                    <TextField
                        InputProps={{
                            readOnly: values.isFinal
                        }}
                        fullWidth
                        maxLength={2000}
                        multiline
                        name="interviewFeedback"
                        onChange={handleChange}
                        placeholder="example feedback"
                        rows="8"
                        type="textarea"
                        value={values.interviewFeedback}
                    />
                    <Badge bg={`${'primary'}`}>
                        {values.interviewFeedback?.length || 0}/{2000}
                    </Badge>
                </FormControl>
            </Box>
            <Button
                color="primary"
                disabled={values.isFinal || !isChanged}
                fullWidth
                onClick={handleSaveDraft}
                sx={{ mb: 1 }}
                variant="outlined"
            >
                {t('Save draft', { ns: 'interviews' })}
            </Button>
            <Button
                color="primary"
                disabled={values.isFinal || !formValidator()}
                fullWidth
                onClick={() => setIsModalOpen(true)}
                variant="contained"
            >
                {t('Submit', { ns: 'common' })}
            </Button>
            <ConfirmationModal
                closeText={t('Cancel', { ns: 'common' })}
                confirmText={t('Submit', { ns: 'common' })}
                content={`${t('Do you want to submit the interview survey?', {
                    ns: 'interviews'
                })} 
                ${t('After submission you can not change the survey anymore.', {
                    ns: 'interviews'
                })}`}
                isLoading={isLoading}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSubmit}
                open={isModalOpen}
                title={t('Attention')}
            />
        </Box>
    );
};

export default Questionnaire;
