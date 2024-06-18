import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Badge,
  TextField
} from '@mui/material';
import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import { getInterview, updateInterviewSurvey } from '../../api';
import Loading from '../../components/Loading/Loading';
import ErrorPage from '../Utils/ErrorPage';
import { appConfig } from '../../config';

const Questionnaire = () => {
  const { interview_id } = useParams();
  const [values, setValues] = React.useState({
    q1: '',
    q2: '',
    q3: '',
    interviewQuestions: ''
  });
  const [interview, setInterview] = React.useState({});
  const [interviewSurveyState, setInterviewSurveyState] = React.useState({});

  useEffect(() => {
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Enforce character limit for interviewQuestions
    if (name === 'interviewQuestions' && value.length > 2000) {
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
        interviewQuestions: values.interviewQuestions
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
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" gutterBottom>
          Interview Training Survey
        </Typography>
        <Typography variant="h6" gutterBottom>
          {interview_name}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {t(
            'Kindly share your experience of our interview training by rating the following statements.',
            { ns: 'interviews' }
          )}
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
