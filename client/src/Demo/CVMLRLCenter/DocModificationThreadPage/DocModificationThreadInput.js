import React, { useEffect, useState } from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Alert,
  Grid,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Collapse,
  CircularProgress,
  Divider,
  InputLabel,
  IconButton,
  MenuItem,
  Modal,
  Link,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  OutlinedInput,
  Select,
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { prepQuestions, convertDate } from '../../Utils/contants';
import {
  LinkableNewlineText,
  getRequirement,
  is_TaiGer_role
} from '../../Utils/checking-functions';
import {
  cvmlrlAi2,
  getSurveyInputs,
  putSurveyInput,
  postSurveyInput
} from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';
import { appConfig } from '../../../config';

// const type2width = { word: 10, sentence: 12, paragraph: 12, essay: 12 };
const type2rows = { word: 1, sentence: 1, paragraph: 4, essay: 10 };

const ConfirmationModal = ({
  isModalOpen,
  setModalOpen,
  title,
  description,
  onYes,
  onNo,
  onCancel = () => {}
}) => {
  const handleActionYes = () => {
    onYes();
    handleModalClose();
  };

  const handleActionNo = () => {
    onNo();
    handleModalClose();
  };

  const handleActionCancel = () => {
    onCancel();
    handleModalClose();
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Modal open={isModalOpen} onClose={handleModalClose}>
      <Paper
        style={{
          padding: 16,
          maxWidth: 300,
          margin: 'auto',
          marginTop: 'calc(50vh - 100px)'
        }}
      >
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          {description}
        </Typography>

        <Button variant="contained" color="primary" onClick={handleActionYes}>
          Yes
        </Button>

        <Button
          variant="contained"
          onClick={handleActionNo}
          sx={{ marginLeft: 1 }}
        >
          No
        </Button>
        <Button
          variant="contained"
          onClick={handleActionCancel}
          sx={{
            marginLeft: 1,
            float: 'right'
          }}
        >
          Cancel
        </Button>
      </Paper>
    </Modal>
  );
};

const ProgressButton = ({
  label = 'Submit',
  progressLabel = 'Submitting',
  onClick,
  isProgress,
  ...buttonProps
}) => {
  return (
    <>
      <Button {...buttonProps} onClick={onClick}>
        {isProgress ? (
          <>
            <CircularProgress size={15} sx={{ marginRight: '0.5rem' }} />
            {progressLabel}
          </>
        ) : (
          label
        )}
      </Button>
    </>
  );
};

const SurveyForm = ({
  title,
  surveyInputs,
  onChange,
  surveyType = 'program',
  useEditButton = false
}) => {
  // if not title provided -> not toggle switch -> must be editable
  const [editMode, setEditMode] = useState(!title || !useEditButton);
  const [collapseOpen, setCollapseOpen] = useState(true);

  const handleTitleClick = (e) => {
    e.stopPropagation();
    setCollapseOpen((prevOpen) => !prevOpen);
  };

  return (
    <Box sx={{ justifyContent: 'flex-end' }}>
      {title && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={handleTitleClick}
          >
            <Grid
              container
              sx={{ gap: 1 }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item>
                <IconButton onClick={handleTitleClick}>
                  {collapseOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="h5">{title}</Typography>
              </Grid>
              {useEditButton && (
                <Grid item>
                  <Button
                    size="small"
                    onClick={(event) => {
                      event.stopPropagation();
                      setEditMode((prevMode) => !prevMode);
                    }}
                  >
                    <EditIcon
                      color={editMode ? 'disabled' : 'primary'}
                      fontSize="small"
                    />
                  </Button>
                </Grid>
              )}
              <Grid item sx={{ marginLeft: 'auto' }}>
                <Typography variant="body2">
                  Last Modified:{' '}
                  {surveyInputs?.updatedAt
                    ? convertDate(surveyInputs?.updatedAt)
                    : '[NEW]'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <Box marginTop={2} />
        </>
      )}
      <Grid container sx={{ gap: 5 }}>
        <Collapse in={collapseOpen}>
          {surveyInputs.surveyContent.map((questionItem, index) => (
            <Grid item key={index} xs={12}>
              <FormControl fullWidth>
                <FormLabel>{questionItem.question}</FormLabel>
                <TextField
                  inputProps={{
                    id: questionItem.questionId,
                    survey: surveyType
                  }}
                  key={index}
                  value={questionItem.answer}
                  placeholder={questionItem.placeholder}
                  multiline
                  rows={type2rows[questionItem.type] || 3}
                  onChange={onChange}
                  disabled={!editMode}
                />
              </FormControl>
            </Grid>
          ))}
        </Collapse>
        {!title && (
          <Grid item sx={{ marginLeft: 'auto' }}>
            <Typography variant="body2">
              Last Modified:{' '}
              {surveyInputs?.updatedAt
                ? convertDate(surveyInputs?.updatedAt)
                : '[NEW]'}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

const InputGenerator = ({
  editorRequirements,
  data,
  isGenerating,
  isGenerated,
  onChange,
  onGenerate
}) => {
  return (
    <>
      <Typography variant="h5" gutterBottom>
        GPT Document Generation
      </Typography>
      <Divider />
      <Box marginTop={2} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="useProgramRequirementData"
                      type="checkbox"
                      checked={editorRequirements?.useProgramRequirementData}
                      onChange={onChange}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: '1.5rem' } }}
                    />
                  }
                  label="Use program's requirement"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="output-lang-label">Output language</InputLabel>
                <Select
                  labelId="output-lang-label"
                  input={<OutlinedInput label="Output language" />}
                  id="output-lang-select"
                  name="outputLanguage"
                  value="English"
                  onChange={onChange}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="German">German</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="gpt-model-label">GPT Model</InputLabel>
                <Select
                  labelId="gpt-model-label"
                  input={<OutlinedInput label="GPT Model" />}
                  id="gpt-model-select"
                  name="gptModel"
                  value="gpt-3.5-turbo"
                  onChange={onChange}
                >
                  <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
                  <MenuItem value="gpt-4-1106-preview">
                    gpt-4-1106-preview
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={5}>
          <FormControl fullWidth>
            <FormLabel>Additional requirement</FormLabel>
            <TextField
              id="additional-requirement"
              name="additionalPrompt"
              onChange={onChange}
              placeholder="The length should be within 10000 characters / words, paragraph structure, etc."
              multiline
              rows={5}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <ProgressButton
            size="small"
            color="primary"
            variant="contained"
            disabled={isGenerating}
            onClick={onGenerate}
            isProgress={isGenerating}
            label={!isGenerated ? 'Generate' : 'Regenerate'}
            progressLabel="Generating"
          />
        </Grid>

        <Grid item xs={12}>
          {(!isGenerating || data) && <LinkableNewlineText text={data} />}
        </Grid>
      </Grid>
    </>
  );
};

function DocModificationThreadInput() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { documentsthreadId } = useParams();
  const [isModalOpen, setModalOpen] = useState(false);
  const [docModificationThreadInputState, setDocModificationThreadInputState] =
    useState({
      documentsthreadId: documentsthreadId,
      error: '',
      isUnchangeAlert: false,
      isChanged: false,
      isGenerating: false,
      isGenerated: false,
      isSubmitting: false,
      editorRequirements: {},
      data: '',
      res_status: 0,
      res_modal_status: 0,
      res_modal_message: ''
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const threadResp = await getSurveyInputs(documentsthreadId);
        const { success, data: threadData, status } = threadResp.data;
        const surveyInputs = threadData?.surveyInputs;

        console.log('threadData', threadData);
        console.log('surveyInputs', surveyInputs);

        if (!surveyInputs?.general) {
          surveyInputs.general = {
            studentId: threadData.student_id._id,
            fileType: threadData.file_type,
            surveyContent: prepQuestions(threadData)
          };
        }
        if (threadData?.program_id?._id && !surveyInputs?.specific) {
          surveyInputs.specific = {
            studentId: threadData.student_id._id,
            programId: threadData.program_id._id,
            fileType: threadData.file_type,
            surveyContent: prepQuestions(threadData, true)
          };
        }

        if (success) {
          setDocModificationThreadInputState((prevState) => ({
            ...prevState,
            success,
            thread: threadData,
            surveyInputs: surveyInputs,
            document_requirements: {},
            editorRequirements: {},
            isLoaded: true,
            res_status: status
          }));
        } else {
          setDocModificationThreadInputState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      } catch (error) {
        setDocModificationThreadInputState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    };
    fetchData();
  }, [documentsthreadId]);

  const ConfirmError = () => {
    setDocModificationThreadInputState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  const onChange = (e) => {
    const id = e.target.id;
    const answer = e.target.value;
    const survey = e.target.getAttribute('survey');
    const surveyInput =
      survey === 'general'
        ? {
            ...docModificationThreadInputState.surveyInputs.general
          }
        : {
            ...docModificationThreadInputState.surveyInputs.specific
          };

    const questionItem = surveyInput.surveyContent.find(
      (question) => question.questionId === id
    );

    questionItem['answer'] = answer;
    if (survey === 'general') {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isChanged: true,
        surveyInputs: {
          ...prevState.surveyInputs,
          general: surveyInput
        }
      }));
    } else {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isChanged: true,
        surveyInputs: {
          ...prevState.surveyInputs,
          specific: surveyInput
        }
      }));
    }
  };

  const onChangeEditorRequirements = (e) => {
    const name = e.target.name;
    if (name === 'useProgramRequirementData') {
      const checked = e.target.checked;
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        editorRequirements: {
          ...docModificationThreadInputState.editorRequirements,
          [name]: checked
        },
        document_requirements: checked
          ? getRequirement(docModificationThreadInputState.thread)
          : ''
      }));
      return;
    }

    const ans = e.target.value;
    setDocModificationThreadInputState((prevState) => ({
      ...prevState,
      editorRequirements: {
        ...prevState.editorRequirements,
        [name]: ans
      }
    }));
  };

  const updateSurveyInput = async (surveyInput, informEditor) => {
    if (!surveyInput._id) {
      return await postSurveyInput(surveyInput, informEditor);
    }
    return await putSurveyInput(surveyInput._id, surveyInput, informEditor);
  };

  const submitInput = async (surveyInputs, informEditor) => {
    setDocModificationThreadInputState((prevState) => ({
      ...prevState,
      isSubmitting: true
    }));
    try {
      let success = true;
      let status = {};
      if (surveyInputs?.general) {
        const res = await updateSurveyInput(surveyInputs.general, informEditor);
        success = success && res.data;
        status['general'] = res;
      }
      if (surveyInputs?.specific) {
        const res = await updateSurveyInput(
          surveyInputs.specific,
          informEditor
        );
        success = success && res.data;
        status['specific'] = res;
      }

      if (success) {
        setDocModificationThreadInputState((prevState) => ({
          ...prevState,
          success,
          isSubmitting: false,
          isChanged: false,
          isUnchangeAlert: false,
          surveyInputs: {
            general: {
              ...docModificationThreadInputState.surveyInputs.general,
              updatedAt: new Date()
            },
            specific: {
              ...docModificationThreadInputState.surveyInputs.specific,
              updatedAt: new Date()
            }
          },
          isLoaded: true,
          res_status: status
        }));
      } else {
        setDocModificationThreadInputState((prevState) => ({
          ...prevState,
          isLoaded: true,
          isSubmitting: false,
          isChanged: false,
          isUnchangeAlert: false,
          res_status: status
        }));
      }
    } catch (error) {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isLoaded: true,
        isSubmitting: false,
        isChanged: false,
        isUnchangeAlert: false,
        error,
        res_status: 500
      }));
    }
  };

  const onSubmit = () => {
    if (!docModificationThreadInputState.isChanged) {
      const alertElement = document.getElementById('alert-message');
      if (alertElement) {
        alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isUnchangeAlert: true
      }));
      return;
    }
    setModalOpen(true);
  };

  const onGenerate = async () => {
    setDocModificationThreadInputState((prevState) => ({
      ...prevState,
      isGenerating: true
    }));
    if (docModificationThreadInputState.isGenerated) {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        data: ''
      }));
    }

    let programFullName = '';
    if (docModificationThreadInputState.thread.program_id) {
      programFullName =
        docModificationThreadInputState.thread.program_id.school +
        '-(' +
        docModificationThreadInputState.thread.program_id.degree +
        ') ';
    }

    const studentInput = [
      ...(docModificationThreadInputState.surveyInputs.general?.surveyContent ||
        []),
      ...(docModificationThreadInputState.surveyInputs.specific
        ?.surveyContent || [])
    ];

    const response = await cvmlrlAi2({
      student_input: JSON.stringify(studentInput),
      document_requirements: JSON.stringify(
        docModificationThreadInputState.document_requirements
      ),
      editor_requirements: JSON.stringify(
        docModificationThreadInputState.editorRequirements
      ),
      student_id:
        docModificationThreadInputState.thread.student_id._id.toString(),
      program_full_name: programFullName,
      file_type: docModificationThreadInputState.thread.file_type
    });

    if (response.status === 403) {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isLoaded: true,
        data: prevState.data + ' \n ================================= \n',
        isGenerating: false,
        isGenerated: true,
        res_modal_status: response.status
      }));
    } else {
      const reader = response.body
        .pipeThrough(new TextDecoderStream())
        .getReader();

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          break;
        }
        setDocModificationThreadInputState((prevState) => ({
          ...prevState,
          data: prevState.data + value
        }));
      }
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isLoaded: true,
        data: prevState.data + ' \n ================================= \n',
        isGenerating: false,
        isGenerated: true,
        res_modal_status: response.status
      }));
    }
  };

  const { isLoaded, res_status } = docModificationThreadInputState;

  if (!isLoaded && !docModificationThreadInputState.thread) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  let docName;
  const student_name = `${docModificationThreadInputState.thread?.student_id?.firstname} ${docModificationThreadInputState.thread?.student_id?.lastname}`;
  if (docModificationThreadInputState.thread?.program_id) {
    docName =
      docModificationThreadInputState.thread.program_id.school +
      '-(' +
      docModificationThreadInputState.thread.program_id.degree +
      ') ' +
      docModificationThreadInputState.thread.program_id.program_name +
      ' ' +
      docModificationThreadInputState.thread.file_type;
  } else {
    docName = docModificationThreadInputState.thread?.file_type;
  }
  TabTitle(`${student_name} ${docName}`);

  return (
    <Box>
      <ConfirmationModal
        isModalOpen={isModalOpen}
        setModalOpen={setModalOpen}
        title="Notify Editor"
        description="Do you want to notify the editors about the changes?"
        onYes={() =>
          submitInput(docModificationThreadInputState.surveyInputs, true)
        }
        onNo={() =>
          submitInput(docModificationThreadInputState.surveyInputs, false)
        }
      />
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
          to={`${DEMO.DOCUMENT_MODIFICATION_LINK(
            docModificationThreadInputState.thread?._id.toString()
          )}`}
        >
          {student_name} {'   '}
          {docName}
          {' Discussion thread'}
          {'   '}
        </Link>
        <Typography>Survey Input</Typography>
      </Breadcrumbs>

      {!isLoaded && <Loading />}
      {docModificationThreadInputState.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={docModificationThreadInputState.res_modal_status}
          res_modal_message={docModificationThreadInputState.res_modal_message}
        />
      )}

      <Card sx={{ p: 2, mb: 2 }}>
        <Typography fontWeight="bold">Requirements:</Typography>
        {docModificationThreadInputState.thread?.program_id ? (
          <>
            <LinkableNewlineText
              text={getRequirement(docModificationThreadInputState.thread)}
            />
          </>
        ) : (
          <Typography>{t('No')}</Typography>
        )}
      </Card>

      <Card sx={{ p: 2, mb: 2 }}>
        <Grid container sx={{ gap: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h5">
              Please answer the following questions in <b>English</b>{' '}
              {docModificationThreadInputState.thread?.program_id?.lang?.includes(
                'German'
              )
                ? '( or German if you like ) '
                : ''}
              !
            </Typography>
          </Grid>

          {docModificationThreadInputState.isUnchangeAlert && (
            <Grid item xs={12}>
              <Alert id="alert-message" severity="error" sx={{ mt: 2 }}>
                <Typography variant="body1" fontWeight="bold">
                  {t('No changes made. Please make changes before submitting.')}
                </Typography>
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <SurveyForm
              title={
                docModificationThreadInputState?.thread?.file_type === 'ML'
                  ? 'General'
                  : null
              }
              surveyInputs={
                docModificationThreadInputState.surveyInputs.general
              }
              surveyType="general"
              onChange={onChange}
              useEditButton={true}
            ></SurveyForm>
          </Grid>

          {docModificationThreadInputState?.thread?.file_type === 'ML' && (
            <Grid item xs={12}>
              <SurveyForm
                title="Program"
                surveyInputs={
                  docModificationThreadInputState.surveyInputs?.specific
                }
                surveyType="program"
                onChange={onChange}
              ></SurveyForm>
            </Grid>
          )}

          <Grid
            item
            xs={12}
            sx={{ gap: 1 }}
            container
            justifyContent="flex-start"
          >
            <ProgressButton
              label="Submit"
              isProgress={docModificationThreadInputState.isSubmitting}
              size="small"
              variant="contained"
              color="primary"
              disabled={docModificationThreadInputState.isSubmitting}
              onClick={onSubmit}
            />
          </Grid>
        </Grid>
      </Card>

      {/* GPT input generation -> only for internal users */}
      {is_TaiGer_role(user) && (
        <Card sx={{ p: 2, mb: 2 }}>
          <InputGenerator
            editorRequirements={
              docModificationThreadInputState.editorRequirements
            }
            data={docModificationThreadInputState.data}
            isGenerating={docModificationThreadInputState.isGenerating}
            isGenerated={docModificationThreadInputState.isGenerated}
            onChange={onChangeEditorRequirements}
            onGenerate={onGenerate}
          />
        </Card>
      )}
    </Box>
  );
}

export default DocModificationThreadInput;
