import React, { useEffect, useState } from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
    Alert,
    Grid,
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Card,
    Checkbox,
    Collapse,
    CircularProgress,
    Divider,
    InputLabel,
    IconButton,
    MenuItem,
    Link,
    FormControl,
    FormControlLabel,
    FormLabel,
    TextField,
    Typography,
    OutlinedInput,
    Select
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { is_TaiGer_role } from '@taiger-common/core';

import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { prepQuestions, convertDate } from '../../../utils/contants';
import {
    LinkableNewlineText,
    getRequirement
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

const type2width = { word: 3, sentence: 5, paragraph: 12, essay: 12 };
const type2rows = { word: 1, sentence: 1, paragraph: 4, essay: 10 };

const ProgressButton = ({
    label = 'Submit',
    progressLabel = 'Submitting',
    onClick,
    isProgress,
    ...buttonProps
}) => {
    return (
        <Button {...buttonProps} onClick={onClick}>
            {isProgress ? (
                <>
                    <CircularProgress
                        size={15}
                        sx={{ marginRight: '0.5rem' }}
                    />
                    {progressLabel}
                </>
            ) : (
                label
            )}
        </Button>
    );
};

const CheckboxSection = ({ isChecked, onChange }) => (
    <Grid item xs={12}>
        <FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={isChecked}
                        name="useProgramRequirementData"
                        onChange={onChange}
                        sx={{ '& .MuiSvgIcon-root': { fontSize: '1.5rem' } }}
                    />
                }
                label="Use program's requirement"
            />
        </FormControl>
    </Grid>
);

const LanguageSelect = ({ onChange }) => (
    <Grid item xs={12}>
        <FormControl fullWidth>
            <InputLabel id="output-lang-label">Output language</InputLabel>
            <Select
                defaultValue=""
                id="output-lang-select"
                input={<OutlinedInput label="Output language" />}
                labelId="output-lang-label"
                name="outputLanguage"
                onChange={onChange}
            >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="German">German</MenuItem>
            </Select>
        </FormControl>
    </Grid>
);

const GPTModelSelect = ({ onChange }) => (
    <Grid item xs={12}>
        <FormControl fullWidth>
            <InputLabel id="gpt-model-label">GPT Model</InputLabel>
            <Select
                defaultValue=""
                id="gpt-model-select"
                input={<OutlinedInput label="GPT Model" />}
                labelId="gpt-model-label"
                name="gptModel"
                onChange={onChange}
            >
                <MenuItem value="gpt-3.5-turbo">gpt-3.5-turbo</MenuItem>
                <MenuItem value="gpt-4-1106-preview">
                    gpt-4-1106-preview
                </MenuItem>
            </Select>
        </FormControl>
    </Grid>
);

const LastModifiedText = ({ updatedAt, isFinalVersion }) => {
    return updatedAt ? (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                justifyContent: 'right'
            }}
        >
            <Typography variant="body2">
                Last Modified: <strong>{convertDate(updatedAt)}</strong>
            </Typography>
            {isFinalVersion ? (
                <Chip color="info" label="Final" size="medium" />
            ) : null}
        </Box>
    ) : (
        <Chip color="secondary" label="New" size="small" variant="outlined" />
    );
};

const SurveyForm = ({
    title,
    surveyInput,
    onChange,
    surveyType = 'program',
    disableEdit = false,
    showEditButton = false,
    isCollapse = true
}) => {
    // editable by default no title, no edit button, or new survey
    const [editMode, setEditMode] = useState(
        !title || !showEditButton || !surveyInput?.updatedAt
    );
    const [collapseOpen, setCollapseOpen] = useState(isCollapse || !title);

    const handleTitleClick = (e) => {
        e.stopPropagation();
        setCollapseOpen((prevOpen) => !prevOpen);
    };

    return (
        <Box>
            {title ? (
                <>
                    <Box
                        onClick={handleTitleClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Grid
                            alignItems="center"
                            container
                            justifyContent="space-between"
                            sx={{ gap: 1 }}
                        >
                            <Grid item>
                                <IconButton onClick={handleTitleClick}>
                                    {collapseOpen ? (
                                        <KeyboardArrowUp />
                                    ) : (
                                        <KeyboardArrowDown />
                                    )}
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">{title}</Typography>
                            </Grid>
                            {showEditButton ? (
                                <Grid item>
                                    <Button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setEditMode(
                                                (prevMode) => !prevMode
                                            );
                                        }}
                                        size="small"
                                    >
                                        <EditIcon
                                            color={
                                                editMode
                                                    ? 'disabled'
                                                    : 'primary'
                                            }
                                            fontSize="small"
                                        />
                                    </Button>
                                </Grid>
                            ) : null}
                            <Grid item sx={{ marginLeft: 'auto' }}>
                                <LastModifiedText
                                    isFinalVersion={surveyInput?.isFinalVersion}
                                    updatedAt={surveyInput?.updatedAt}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box marginTop={2} />
                </>
            ) : null}
            {!title ? (
                <Box sx={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <LastModifiedText
                        isFinalVersion={surveyInput?.isFinalVersion}
                        updatedAt={surveyInput?.updatedAt}
                    />
                </Box>
            ) : null}
            <Collapse in={collapseOpen}>
                <Grid container sx={{ gap: 1 }}>
                    {surveyInput.surveyContent.map((questionItem, index) => (
                        <Grid
                            item
                            key={index}
                            sm={type2width[questionItem.type] || 3}
                            xs={12}
                        >
                            <FormControl fullWidth>
                                <FormLabel>{questionItem.question}</FormLabel>
                                <TextField
                                    disabled={
                                        surveyInput?.isFinalVersion ||
                                        disableEdit ||
                                        !editMode
                                    }
                                    inputProps={{
                                        id: questionItem.questionId,
                                        survey: surveyType
                                    }}
                                    key={index}
                                    multiline
                                    onChange={onChange}
                                    placeholder={questionItem.placeholder}
                                    rows={type2rows[questionItem.type] || 3}
                                    value={questionItem.answer}
                                />
                            </FormControl>
                        </Grid>
                    ))}
                </Grid>
            </Collapse>
        </Box>
    );
};

const InputGenerator = ({
    isChecked,
    data,
    isGenerating,
    onChange,
    onGenerate
}) => {
    return (
        <>
            <Typography gutterBottom variant="h5">
                GPT Document Generation
            </Typography>
            <Divider />
            <Box marginTop={2} />
            <Grid container spacing={2}>
                <Grid item md={2} xs={12}>
                    <Grid container spacing={1}>
                        <CheckboxSection
                            isChecked={isChecked}
                            onChange={onChange}
                        />
                        <LanguageSelect onChange={onChange} />
                        <GPTModelSelect onChange={onChange} />
                    </Grid>
                </Grid>
                <Grid item md={5} xs={12}>
                    <FormControl fullWidth>
                        <FormLabel>Additional requirement</FormLabel>
                        <TextField
                            id="additional-requirement"
                            multiline
                            name="additionalPrompt"
                            onChange={onChange}
                            placeholder="The length should be within 10000 characters / words, paragraph structure, etc."
                            rows={5}
                        />
                    </FormControl>
                </Grid>

                <Grid item xs={12}>
                    <ProgressButton
                        color="primary"
                        disabled={isGenerating}
                        isProgress={isGenerating}
                        label={!data ? 'Generate' : 'Regenerate'}
                        onClick={onGenerate}
                        progressLabel="Generating"
                        size="small"
                        variant="contained"
                    />
                </Grid>

                <Grid item xs={12}>
                    {!isGenerating || data ? (
                        <LinkableNewlineText text={data} />
                    ) : null}
                </Grid>
            </Grid>
        </>
    );
};

const DocModificationThreadInput = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { documentsthreadId } = useParams();
    const [isLoaded, setIsLoaded] = useState(false);
    const [thread, setThread] = useState({});
    const [isChanged, setIsChanged] = useState({
        general: false,
        specific: false
    });
    const [isFinalVersion, setIsFinalVersion] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showUnchangeAlert, setShowUnchangeAlert] = useState(false);
    const [surveyInputs, setSurveyInputs] = useState({
        general: {},
        specific: {}
    });
    const [gptData, setgptData] = useState('');
    // const [generatorState, setGeneratorState] = useState({});
    const [
        docModificationThreadInputState,
        setDocModificationThreadInputState
    ] = useState({
        editorRequirements: {},
        res_status: 0,
        res_modal_status: 0,
        res_modal_message: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const threadResp = await getSurveyInputs(documentsthreadId);
                const { success, data: threadData, status } = threadResp.data;
                const surveyData = threadData?.surveyInputs || {};
                if (!surveyData?.general) {
                    surveyData.general = {
                        studentId: threadData.student_id._id,
                        fileType: threadData.file_type,
                        surveyContent: prepQuestions(threadData)
                    };
                }
                if (threadData?.program_id?._id && !surveyData?.specific) {
                    surveyData.specific = {
                        studentId: threadData.student_id._id,
                        programId: threadData.program_id._id,
                        fileType: threadData.file_type,
                        surveyContent: prepQuestions(threadData, true)
                    };
                }

                setIsLoaded(true);
                if (success) {
                    setThread(threadData);
                    setSurveyInputs({ ...surveyData });
                    setDocModificationThreadInputState((prevState) => ({
                        ...prevState,
                        document_requirements: {},
                        editorRequirements: {},
                        res_status: status
                    }));
                } else {
                    setDocModificationThreadInputState((prevState) => ({
                        ...prevState,
                        res_status: status
                    }));
                }
            } catch (error) {
                setDocModificationThreadInputState((prevState) => ({
                    ...prevState,
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

        setSurveyInputs((prevState) => {
            const surveyInput =
                survey === 'general'
                    ? {
                          ...prevState.general
                      }
                    : {
                          ...prevState.specific
                      };

            const questionItem = surveyInput.surveyContent.find(
                (question) => question.questionId === id
            );
            questionItem['answer'] = answer;
            return prevState;
        });

        setIsChanged((prevState) => ({
            ...prevState,
            [survey]: true
        }));
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
                document_requirements: checked ? getRequirement(thread) : ''
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
        let newSurvey;
        if (!surveyInput?._id) {
            newSurvey = await postSurveyInput(surveyInput, informEditor);
        } else {
            newSurvey = await putSurveyInput(
                surveyInput._id,
                surveyInput,
                informEditor
            );
        }
        return newSurvey;
    };

    const submitInput = async () => {
        try {
            let allStatus = {};
            if (isChanged?.general && surveyInputs?.general) {
                // only set final if general survey, where programId not present
                const genIsFinalVersion = !thread?.program_id && isFinalVersion;
                const {
                    status,
                    data: { success, data }
                } = await updateSurveyInput(
                    {
                        ...surveyInputs.general,
                        isFinalVersion: genIsFinalVersion
                    },
                    genIsFinalVersion
                );

                allStatus['general'] = status;
                if (success) {
                    setSurveyInputs((prevState) => ({
                        ...prevState,
                        general: data
                    }));
                }
            }
            if (isChanged?.specific && surveyInputs?.specific) {
                const {
                    status,
                    data: { success, data }
                } = await updateSurveyInput(
                    { ...surveyInputs.specific, isFinalVersion },
                    isFinalVersion
                );
                allStatus['specific'] = status;
                if (success) {
                    setSurveyInputs((prevState) => ({
                        ...prevState,
                        specific: data
                    }));
                }
            }

            setDocModificationThreadInputState((prevState) => ({
                ...prevState,
                res_status: allStatus
            }));
        } catch (error) {
            setDocModificationThreadInputState((prevState) => ({
                ...prevState,
                res_status: 500
            }));
        }
    };

    const onSubmit = async () => {
        if (!isChanged.general && !isChanged.specific) {
            const alertElement = document.getElementById('alert-message');
            if (alertElement) {
                alertElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            setShowUnchangeAlert(true);
            return;
        }
        setIsSubmitting(true);
        await submitInput(surveyInputs, isFinalVersion);
        setIsChanged({ general: false, specific: false });
        setIsSubmitting(false);
        setIsLoaded(true);
        setShowUnchangeAlert(false);
    };

    const onGenerate = async () => {
        setIsGenerating(true);
        // reset data to empty (in case of re-generate)
        setgptData('');

        let programFullName = '';
        if (thread.program_id) {
            programFullName =
                thread.program_id.school +
                '-(' +
                thread.program_id.degree +
                ') ';
        }

        const studentInput = [
            ...(surveyInputs.general?.surveyContent || []),
            ...(surveyInputs.specific?.surveyContent || [])
        ];

        const response = await cvmlrlAi2({
            student_input: JSON.stringify(studentInput),
            document_requirements: JSON.stringify(
                docModificationThreadInputState.document_requirements
            ),
            editor_requirements: JSON.stringify(
                docModificationThreadInputState.editorRequirements
            ),
            student_id: thread.student_id._id.toString(),
            program_full_name: programFullName,
            file_type: thread.file_type
        });

        setIsLoaded(true);
        if (response.status === 403) {
            setIsGenerating(false);
            setgptData(
                (prevData) =>
                    prevData + ' \n ================================= \n'
            );
            setDocModificationThreadInputState((prevState) => ({
                ...prevState,
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
                setgptData((prevData) => prevData + value);
            }
            setIsGenerating(false);
            setgptData(
                (prevData) =>
                    prevData + ' \n ================================= \n'
            );
            setDocModificationThreadInputState((prevState) => ({
                ...prevState,
                res_modal_status: response.status
            }));
        }
    };

    const { res_status } = docModificationThreadInputState;

    if (!isLoaded && !Object.keys(thread).length) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }

    if (thread?.file_type?.includes('RL')) {
        return <ErrorPage res_status={403} />;
    }

    let docName;
    const student_name = `${thread?.student_id?.firstname} ${thread?.student_id?.lastname}`;
    if (thread?.program_id) {
        docName =
            thread.program_id.school +
            '-(' +
            thread.program_id.degree +
            ') ' +
            thread.program_id.program_name +
            ' ' +
            thread.file_type;
    } else {
        docName = thread?.file_type;
    }
    TabTitle(`${student_name} ${docName}`);

    const isFinalLocked =
        (thread?.program_id && surveyInputs?.specific?.isFinalVersion) ||
        surveyInputs?.general?.isFinalVersion;

    const editorRequirements =
        docModificationThreadInputState?.editorRequirements;

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
                    to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                        thread?.student_id?._id.toString(),
                        DEMO.CVMLRL_HASH
                    )}`}
                    underline="hover"
                >
                    {student_name}
                </Link>
                <Link
                    color="inherit"
                    component={LinkDom}
                    to={`${DEMO.DOCUMENT_MODIFICATION_LINK(thread?._id.toString())}`}
                    underline="hover"
                >
                    {docName}
                    {' Discussion thread'}
                    {'   '}
                </Link>
                <Typography>{t('Survey')}</Typography>
            </Breadcrumbs>

            {!isLoaded ? <Loading /> : null}
            {docModificationThreadInputState.res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={
                        docModificationThreadInputState.res_modal_message
                    }
                    res_modal_status={
                        docModificationThreadInputState.res_modal_status
                    }
                />
            ) : null}

            <Card sx={{ p: 2, mb: 2 }}>
                <Typography fontWeight="bold">Requirements:</Typography>
                {thread?.program_id ? (
                    <LinkableNewlineText text={getRequirement(thread)} />
                ) : (
                    <Typography>{t('No', { ns: 'common' })}</Typography>
                )}
            </Card>

            <Card sx={{ p: 2, mb: 2 }}>
                <Grid container sx={{ gap: 2 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5">
                            Please answer the following questions in{' '}
                            <b>English</b>{' '}
                            {thread?.program_id?.lang?.includes('German')
                                ? '( or German if you like ) '
                                : ''}
                            !
                        </Typography>
                    </Grid>

                    {showUnchangeAlert ? (
                        <Grid item xs={12}>
                            <Alert
                                id="alert-message"
                                severity="error"
                                sx={{ mt: 2 }}
                            >
                                <Typography fontWeight="bold" variant="body1">
                                    {t(
                                        'No changes made. Please make changes before submitting.'
                                    )}
                                </Typography>
                            </Alert>
                        </Grid>
                    ) : null}

                    {Object.keys(surveyInputs?.general).length > 0 ? (
                        <Grid item xs={12}>
                            <SurveyForm
                                disableEdit={isFinalLocked || isFinalVersion}
                                isCollapse={!surveyInputs?.general?.updatedAt}
                                onChange={onChange}
                                surveyInput={surveyInputs.general}
                                surveyType="general"
                                title={thread?.program_id ? 'General' : null}
                            />
                        </Grid>
                    ) : null}

                    {thread?.program_id &&
                    Object.keys(surveyInputs?.specific).length > 0 ? (
                        <Grid item xs={12}>
                            <SurveyForm
                                disableEdit={isFinalVersion}
                                onChange={onChange}
                                surveyInput={surveyInputs.specific}
                                surveyType="specific"
                                title="Program"
                            />
                        </Grid>
                    ) : null}

                    <Grid item xs={12}>
                        <FormControl>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            isFinalLocked || isFinalVersion
                                        }
                                        disabled={isFinalLocked}
                                        name="isFinalVersion"
                                        onChange={(e) => {
                                            setIsChanged({
                                                general: true,
                                                specific: true
                                            });
                                            setIsFinalVersion(e.target.checked);
                                        }}
                                        type="checkbox"
                                    />
                                }
                                label="Is Final Version?"
                            />
                        </FormControl>
                    </Grid>

                    <Grid
                        container
                        item
                        justifyContent="flex-start"
                        sx={{ gap: 1 }}
                        xs={12}
                    >
                        {!isFinalLocked ? (
                            <ProgressButton
                                color="primary"
                                disabled={isSubmitting}
                                isProgress={isSubmitting}
                                label="Submit"
                                onClick={onSubmit}
                                size="small"
                                variant="contained"
                            />
                        ) : null}
                        <LinkDom relative="path" to="..">
                            <Button color="secondary" variant="contained">
                                Back
                            </Button>
                        </LinkDom>
                    </Grid>
                </Grid>
            </Card>

            {/* GPT input generation -> only for internal users */}
            {is_TaiGer_role(user) ? (
                <Card sx={{ p: 2, mb: 2 }}>
                    <InputGenerator
                        data={gptData}
                        isChecked={
                            editorRequirements?.useProgramRequirementData ||
                            false
                        }
                        isGenerating={isGenerating}
                        onChange={onChangeEditorRequirements}
                        onGenerate={onGenerate}
                    />
                </Card>
            ) : null}
        </Box>
    );
};

export default DocModificationThreadInput;
