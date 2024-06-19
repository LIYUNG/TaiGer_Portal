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
import {
  getInterview,
  getInterviewSurvey,
  updateInterviewSurvey
} from '../../api';
import Loading from '../../components/Loading/Loading';
import ErrorPage from '../Utils/ErrorPage';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { is_TaiGer_role } from '../Utils/checking-functions';
import { useAuth } from '../../components/AuthProvider';

const Questionnaire = () => {
  const { interview_id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [values, setValues] = React.useState({
    q1: '',
    q2: '',
    q3: '',
    interviewQuestions: '',
    interviewFeedback: ''
  });
  const [interview, setInterview] = React.useState({});
  const [interviewSurveyState, setInterviewSurveyState] = React.useState({});

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
        console.log(result);
        setValues({
          ...result,
          interviewQuestions: data.interviewQuestions,
          interviewFeedback: data.interviewFeedback
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
    setValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
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

  const { res_status, editorDescriptionState, isLoaded } = interviewSurveyState;

  if (!isLoaded && !editorDescriptionState) {
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
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.INTERVIEW_LINK}`}
        >
          {is_TaiGer_role(user)
            ? t('All Interviews', { ns: 'interviews' })
            : t('My Interviews', { ns: 'interviews' })}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.INTERVIEW_SINGLE_LINK(interview_id)}`}
        >
          {interview_name}
        </Link>
        <Typography color="text.primary">
          {t('Survey', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {t('Interview Training Survey', { ns: 'interviews' })}
        </Typography>
        <Typography variant="h6">{interview_name}</Typography>
        <Typography variant="h6">
          {t(
            'Kindly share your experience of our interview training by rating the following statements.',
            { ns: 'interviews' }
          )}
        </Typography>
        <Typography variant="body2" fontWeight="bold" sx={{ my: 1 }}>
          {t('1. not agree    5. strongly aggree', { ns: 'interviews' })}
        </Typography>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t(
              'The interview training materials provided beforehand were beneficial for my official interview.',
              { ns: 'interviews' }
            )}
          </FormLabel>
          <RadioGroup
            row
            aria-label="q1"
            name="q1"
            value={values.q1}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={String(value)}
                control={<Radio />}
                label={String(value)}
                labelPlacement="top"
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
            row
            aria-label="q2"
            name="q2"
            value={values.q2}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={String(value)}
                control={<Radio />}
                label={String(value)}
                labelPlacement="top"
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
            row
            aria-label="q3"
            name="q3"
            value={values.q3}
            onChange={handleChange}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <FormControlLabel
                key={value}
                value={String(value)}
                control={<Radio />}
                label={String(value)}
                labelPlacement="top"
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box sx={{ mb: 1 }}>
        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend">
            {t(`Please provide the interview questions to {{brandName}}`, {
              ns: 'interviews',
              brandName: appConfig.companyName
            })}
          </FormLabel>
          <TextField
            fullWidth
            type="textarea"
            maxLength={2000}
            multiline
            name="interviewQuestions"
            rows="10"
            placeholder="example questions"
            value={values.interviewQuestions}
            onChange={handleChange}
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
            fullWidth
            type="textarea"
            maxLength={2000}
            multiline
            name="interviewFeedback"
            rows="8"
            placeholder="example feedback"
            value={values.interviewFeedback}
            onChange={handleChange}
          />
          <Badge bg={`${'primary'}`}>
            {values.interviewFeedback?.length || 0}/{2000}
          </Badge>
        </FormControl>
      </Box>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
      >
        {t('Submit', { ns: 'common' })}
      </Button>
    </Box>
  );
};

export default Questionnaire;
