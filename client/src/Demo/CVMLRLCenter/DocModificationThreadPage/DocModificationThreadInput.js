import React, { useEffect, useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import {
  Grid,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  InputLabel,
  MenuItem,
  CircularProgress,
  Link,
  FormGroup,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Select
} from '@mui/material';

import { Link as LinkDom, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  getMessagThread,
  getSurveyInputsByThreadId,
  putStudentInput,
  resetSurveyInput
} from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';
import { appConfig } from '../../../config';

function DocModificationThreadInput() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { documentsthreadId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [docModificationThreadInputState, setDocModificationThreadInputState] =
    useState({
      error: '',
      isGenerating: false,
      isGenerated: false,
      isFirstDataArrived: false,
      isSaving: false,
      isResetting: false,
      isSubmitting: false,
      student_input: [],
      editor_requirements: {},
      data: '',
      res_status: 0,
      res_modal_status: 0,
      res_modal_message: ''
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const threadResp = await getMessagThread(documentsthreadId);
        const { success, data: threadData, status } = threadResp.data;
        const surveyResp = await getSurveyInputsByThreadId(documentsthreadId);
        const { data: surveyData } = surveyResp.data;

        const surveyInputs = {
          general: surveyData?.general,
          specific: surveyData?.specific
        };

        // TODO: prepQuestion if not defined
        if (!surveyInputs?.general) {
          surveyInputs.general = {
            surveyContent: prepQuestions(threadData)
          };
        }
        if (!surveyInputs?.specific) {
          surveyInputs.specific = {
            surveyContent: prepQuestions(threadData)
          };
        }

        if (success) {
          setDocModificationThreadInputState((prevState) => ({
            ...prevState,
            success,
            thread: threadData,
            surveyInputs: surveyInputs,
            document_requirements: {},
            editor_requirements: {},
            isLoaded: true,
            documentsthreadId: documentsthreadId,
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
  }, []);

  const ConfirmError = () => {
    setDocModificationThreadInputState((prevState) => ({
      ...prevState,
      res_modal_status: 0,
      res_modal_message: ''
    }));
  };

  // eslint-disable-next-line no-unused-vars
  const onChange = (e) => {
    const id = e.target.id;
    const ans = e.target.value;
    const temp_student_input = {
      ...docModificationThreadInputState.student_input
    };
    const temp_q = temp_student_input.input_content.find(
      (qa) => qa.question_id === id
    );
    temp_q.answer = ans;
    setDocModificationThreadInputState((prevState) => ({
      ...prevState,
      student_input: temp_student_input
    }));
  };

  const onChangeEditorRequirements = (e) => {
    const id = e.target.id;
    if (id === 'useProgramRequirementData') {
      const checked = e.target.checked;
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        editor_requirements: {
          ...docModificationThreadInputState.editor_requirements,
          [id]: checked
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
      editor_requirements: {
        ...prevState.editor_requirements,
        [id]: ans
      }
    }));
  };
  const onReset = () => {
    setDocModificationThreadInputState((prevState) => ({
      ...prevState,
      isResetting: true
    }));

    const resetInput = async (surveyInputs) => {
      if (!surveyInputs?.specific) {
        return;
      }
      await resetSurveyInput(surveyInputs.specific._id.toString());
    };

    try {
      resetInput(docModificationThreadInputState.surveyInputs);
    } catch (error) {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isLoaded: true,
        isResetting: false,
        error,
        res_status: 500
      }));
    }
    setDocModificationThreadInputState((prevState) => {
      const surveyInputs = prevState && prevState.surveyInputs;
      const specific = surveyInputs && surveyInputs.specific;

      if (surveyInputs && specific) {
        return {
          ...prevState,
          isResetting: false,
          surveyInputs: {
            ...surveyInputs,
            specific: {
              ...specific,
              surveyContent: [],
              updatedAt: new Date()
            }
          }
        };
      }
      return { ...prevState, isResetting: false };
    });
  };

  const onSubmitInput = (student_input, informEditor) => {
    if (informEditor) {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isSubmitting: true
      }));
    } else {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isSaving: true
      }));
    }

    putStudentInput(
      documentsthreadId,
      JSON.stringify(student_input.input_content),
      informEditor
    ).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;

        if (success) {
          setDocModificationThreadInputState((prevState) => ({
            ...prevState,
            success,
            isSaving: false,
            isSubmitting: false,
            student_input: {
              ...docModificationThreadInputState.student_input,
              updatedAt: new Date()
            },
            isLoaded: true,
            res_status: status
          }));
        } else {
          setDocModificationThreadInputState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isSaving: false,
            isSubmitting: false,
            res_status: status
          }));
        }
      },
      (error) => {
        setDocModificationThreadInputState((prevState) => ({
          ...prevState,
          isLoaded: true,
          isSaving: false,
          isSubmitting: false,
          error,
          res_status: 500
        }));
      }
    );
  };

  const onSubmit = async () => {
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
    // Mock
    // fetchData();
    let program_full_name = '';
    if (docModificationThreadInputState.thread.program_id) {
      program_full_name =
        docModificationThreadInputState.thread.program_id.school +
        '-(' +
        docModificationThreadInputState.thread.program_id.degree +
        ') ';
    }
    const response = await cvmlrlAi2({
      student_input: JSON.stringify(
        docModificationThreadInputState.student_input
      ),
      document_requirements: JSON.stringify(
        docModificationThreadInputState.document_requirements
      ),
      editor_requirements: JSON.stringify(
        docModificationThreadInputState.editor_requirements
      ),
      student_id:
        docModificationThreadInputState.thread.student_id._id.toString(),
      program_full_name: program_full_name,
      file_type: docModificationThreadInputState.thread.file_type
    });

    if (response.status === 403) {
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isLoaded: true,
        data: prevState.data + ' \n ================================= \n',
        isFirstDataArrived: false,
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
          isFirstDataArrived: true,
          data: prevState.data + value
        }));
      }
      setDocModificationThreadInputState((prevState) => ({
        ...prevState,
        isLoaded: true,
        data: prevState.data + ' \n ================================= \n',
        isFirstDataArrived: false,
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
        <Typography>{t('Input')}</Typography>
      </Breadcrumbs>
      {!isLoaded && <Loading />}
      {docModificationThreadInputState.res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={docModificationThreadInputState.res_modal_status}
          res_modal_message={docModificationThreadInputState.res_modal_message}
        />
      )}
      {is_TaiGer_role(user) ? (
        <Card sx={{ mt: 2 }}>
          <Typography>
            Beta testing: Please carefully review the generated output.
          </Typography>
        </Card>
      ) : (
        <Card sx={{ mt: 2 }}>
          <Typography>Beta testing: don&apos;t use it.</Typography>
        </Card>
      )}
      {is_TaiGer_role(user) && (
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">
            In case you don&apos;t have permission, please contact Travis.
          </Typography>
        </Card>
      )}
      {docModificationThreadInputState.thread?.isFinalVersion && (
        <Grid className="sticky-top">
          <Typography>
            Status: <b>Close</b>
          </Typography>
        </Grid>
      )}

      <Card sx={{ p: 2 }}>
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

      <Card sx={{ p: 2 }}>
        <Typography variant="h5">
          Please answer the following questions in <b>English</b>{' '}
          {docModificationThreadInputState.thread?.program_id?.lang?.includes(
            'German'
          )
            ? '( or German if you like ) '
            : ''}
          !
        </Typography>

        <Typography variant="h6">General</Typography>
        <Button onClick={() => setEditMode((prevMode) => !prevMode)}>
          {editMode ? 'Disable Edit Mode' : 'Enable Edit Mode'}
        </Button>
        <Grid container spacing={4}>
          {docModificationThreadInputState.surveyInputs?.general?.surveyContent.map(
            (qa, i) => (
              <Grid item md={qa.width || 12} xs={12} sm={6} key={i}>
                <form className="mb-2" key={i}>
                  <FormGroup>
                    <FormLabel>{qa.question}</FormLabel>
                    <TextField
                      multiline={true}
                      rows={qa.rows || '1'}
                      placeholder={qa.placeholder}
                      defaultValue={qa.answer}
                      disabled={!editMode}
                      // onChange={onChange}
                    />
                  </FormGroup>
                </form>
              </Grid>
            )
          )}
        </Grid>
        <Typography variant="h7">Program</Typography>
        {docModificationThreadInputState.surveyInputs?.specific?.surveyContent.map(
          (qa, i) => (
            <Grid item md={qa.width || 12} xs={12} sm={6} key={i}>
              <form className="mb-2" key={i}>
                <FormGroup>
                  <FormLabel>{qa.question}</FormLabel>
                  <TextField
                    multiline={true}
                    rows={qa.rows || '1'}
                    placeholder={qa.placeholder}
                    defaultValue={qa.answer}
                    // onChange={onChange}
                  />
                </FormGroup>
              </form>
            </Grid>
          )
        )}
        <Button
          size="small"
          variant="contained"
          color="primary"
          disabled={docModificationThreadInputState.isSaving}
          onClick={() =>
            onSubmitInput(docModificationThreadInputState.student_input, true)
          }
        >
          {docModificationThreadInputState.isSubmitting ? (
            <>
              <CircularProgress />
              Submitting
            </>
          ) : (
            'Submit'
          )}
        </Button>
        <Button
          size="small"
          color="secondary"
          variant="outlined"
          disabled={docModificationThreadInputState.isSaving}
          onClick={() =>
            onSubmitInput(docModificationThreadInputState.student_input, false)
          }
        >
          {docModificationThreadInputState.isSaving ? (
            <>
              <CircularProgress />
              {t('Saving')}
            </>
          ) : (
            t('Save as draft')
          )}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onReset()}>
          {docModificationThreadInputState.isResetting ? (
            <>
              <CircularProgress />
              {'  '}
              {t('Resetting')}
            </>
          ) : (
            t('Reset')
          )}
        </Button>
        <span style={{ float: 'right' }}>
          Updated At:{' '}
          {convertDate(
            docModificationThreadInputState.student_input?.updatedAt
          )}
        </span>
      </Card>

      {is_TaiGer_role(user) && (
        <Card sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <form>
                <FormGroup>
                  <FormLabel>{t("Use program's requirements?")}</FormLabel>
                  <Checkbox
                    type="checkbox"
                    checked={
                      docModificationThreadInputState.editor_requirements
                        ?.useProgramRequirementData
                    }
                    onChange={onChangeEditorRequirements}
                  />
                </FormGroup>
              </form>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="output-lang-label">Output language?</InputLabel>
                <Select
                  labelId="output-lang-label"
                  id="output-lang-select"
                  value="English"
                  label="Language"
                  onChange={(e) => {
                    onChangeEditorRequirements(e);
                  }}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="German">German</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <form>
                <FormGroup>
                  <InputLabel id="gpt-model-label">GPT Model?</InputLabel>
                  <Select
                    defaultValue="gpt-3.5-turbo"
                    onChange={(e) => {
                      onChangeEditorRequirements(e);
                    }}
                  >
                    <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
                    <MenuItem value="gpt-3.5-turbo-16k">
                      gpt-3.5-turbo-16k
                    </MenuItem>
                    <MenuItem value="gpt-4">gpt-4</MenuItem>
                    <MenuItem value="gpt-4-32k">gpt-4-32k</MenuItem>
                    <MenuItem value="text-embedding-ada-002">
                      text-embedding-ada-002
                    </MenuItem>
                    <MenuItem value="gpt-4-1106-preview">
                      gpt-4-1106-preview
                    </MenuItem>
                  </Select>
                </FormGroup>
              </form>
            </Grid>

            <Grid item xs={12} md={6}>
              <form>
                <FormGroup>
                  <FormLabel>Additional requirement?</FormLabel>
                  <FormControl
                    onChange={(e) => {
                      onChangeEditorRequirements(e);
                    }}
                    placeholder="the length should be within 10000 characters / words, paragraph structure, etc."
                    as="textarea"
                  />
                </FormGroup>
              </form>
            </Grid>

            <Grid item xs={12}>
              <Button
                size="small"
                color="primary"
                variant="contained"
                disabled={docModificationThreadInputState.isGenerating}
                onClick={onSubmit}
              >
                {docModificationThreadInputState.isGenerating ? (
                  <>
                    <CircularProgress />
                    {'  Generating'}
                  </>
                ) : docModificationThreadInputState.isGenerated ? (
                  'Regenerate'
                ) : (
                  'Generate'
                )}
              </Button>
            </Grid>

            {docModificationThreadInputState.isGenerating &&
            !docModificationThreadInputState.data ? (
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={7} /> <Placeholder xs={5} />{' '}
                <Placeholder xs={4} /> <Placeholder xs={8} />{' '}
                <Placeholder xs={2} /> <Placeholder xs={3} />{' '}
                <Placeholder xs={2} /> <Placeholder xs={3} />{' '}
                <Placeholder xs={10} /> <Placeholder xs={1} />{' '}
                <Placeholder xs={2} /> <Placeholder xs={3} />{' '}
                <Placeholder xs={9} /> <Placeholder xs={2} />{' '}
                <Placeholder xs={2} /> <Placeholder xs={3} />{' '}
                <Placeholder xs={1} /> <Placeholder xs={9} />{' '}
                <Placeholder xs={4} /> <Placeholder xs={8} />
              </Placeholder>
            ) : (
              <LinkableNewlineText
                text={docModificationThreadInputState.data}
              ></LinkableNewlineText>
            )}
          </Grid>
        </Card>
      )}
    </Box>
  );
}

export default DocModificationThreadInput;
