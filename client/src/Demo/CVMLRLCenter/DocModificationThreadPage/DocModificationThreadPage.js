import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as LinkDom, useLocation, useParams } from 'react-router-dom';
// import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import { green, grey } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import {
    Typography,
    Button,
    FormControlLabel,
    Checkbox,
    Card,
    Link,
    Box,
    CircularProgress,
    Grid,
    Breadcrumbs,
    useTheme,
    Avatar,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Stack,
    Tabs,
    Tab
} from '@mui/material';
import { pdfjs } from 'react-pdf'; // Library for rendering PDFs
import {
    is_TaiGer_AdminAgent,
    is_TaiGer_Student,
    is_TaiGer_role
} from '@taiger-common/core';
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import DocThreadEditor from '../../../components/Message/DocThreadEditor';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import {
    stringAvatar,
    templatelist,
    THREAD_REVERSED_TABS,
    THREAD_TABS
} from '../../../utils/contants';
import {
    AGENT_SUPPORT_DOCUMENTS_A,
    FILE_TYPE_E,
    LinkableNewlineText,
    getRequirement,
    readDOCX,
    readPDF,
    readXLSX,
    toogleItemInArray
} from '../../Utils/checking-functions';
import { BASE_URL } from '../../../api/request';
import {
    SubmitMessageWithAttachment,
    getMessagThread,
    deleteAMessageInThread,
    SetFileAsFinal,
    updateEssayWriter,
    putOriginAuthorConfirmedByStudent,
    putThreadFavorite
} from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import FilesList from './FilesList';
import { appConfig } from '../../../config';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';
import EditEssayWritersSubpage from '../../Dashboard/MainViewTab/StudDocsOverview/EditEssayWritersSubpage';
import { TopBar } from '../../../components/TopBar/TopBar';
import MessageList from '../../../components/Message/MessageList';
import DocumentCheckingResultModal from './DocumentCheckingResultModal';
import { a11yProps, CustomTabPanel } from '../../../components/Tabs';
import Audit from '../../Audit';
import i18next from 'i18next';

const getMessagThreadQuery = (threadId) => ({
    queryKey: ['MessageThread', threadId],
    queryFn: async () => {
        try {
            const response = await getMessagThread(threadId);
            return response;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    staleTime: 1000 * 60, // 1 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
});

const DescriptionBlock = ({ thread, template_obj, documentsthreadId }) => {
    const { user } = useAuth();
    return (
        <Box>
            {template_obj ? (
                <>
                    <Typography variant="body1">
                        {thread.file_type === 'CV'
                            ? i18next.t('cv-instructions', {
                                  ns: 'cvmlrl'
                              })
                            : i18next.t('please-fill-template', {
                                  tenant: appConfig.companyName
                              })}
                        :
                    </Typography>
                    <LinkDom to={`${DEMO.CV_ML_RL_DOCS_LINK}`}>
                        <Button color="info" size="small" variant="contained">
                            {i18next.t('Read More')}
                        </Button>
                    </LinkDom>
                    <Typography variant="body1">
                        {i18next.t('Download template')}:{' '}
                        {template_obj ? (
                            template_obj.prop.includes('RL') ||
                            template_obj.alias.includes('Recommendation') ? (
                                <b>
                                    {i18next.t('Professor')}：
                                    <a
                                        href={`${BASE_URL}/api/account/files/template/${'RL_academic_survey_lock'}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Button
                                            color="secondary"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            variant="contained"
                                        >
                                            {i18next.t('Download', {
                                                ns: 'common'
                                            })}
                                        </Button>
                                    </a>
                                    {i18next.t('Supervisor')}：
                                    <a
                                        href={`${BASE_URL}/api/account/files/template/${`RL_employer_survey_lock`}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Button
                                            color="secondary"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            variant="contained"
                                        >
                                            {i18next.t('Download', {
                                                ns: 'common'
                                            })}
                                        </Button>
                                    </a>
                                </b>
                            ) : (
                                <b>
                                    <a
                                        href={`${BASE_URL}/api/account/files/template/${template_obj.prop}`}
                                        rel="noopener noreferrer"
                                        target="_blank"
                                    >
                                        <Button
                                            color="secondary"
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            variant="contained"
                                        >
                                            {i18next.t('Download', {
                                                ns: 'common'
                                            })}
                                        </Button>
                                    </a>
                                    <br />
                                    {is_TaiGer_role(user) ? (
                                        <LinkDom
                                            to={`${DEMO.DOCUMENT_MODIFICATION_INPUT_LINK(
                                                documentsthreadId
                                            )}`}
                                        >
                                            <Button
                                                color="secondary"
                                                sx={{
                                                    my: 2
                                                }}
                                                variant="contained"
                                            >
                                                Editor Helper
                                            </Button>
                                        </LinkDom>
                                    ) : null}
                                </b>
                            )
                        ) : (
                            <>Not available</>
                        )}
                    </Typography>
                </>
            ) : (
                <Typography>
                    {thread.file_type === 'Portfolio'
                        ? 'Please upload the portfolio in Microsoft Word form here so that your Editor can help you for the text modification'
                        : thread.file_type === 'Supplementary_Form'
                          ? '請填好這個 program 的 Supplementory Form，並在這討論串夾帶該檔案 (通常為 .xls, xlsm, .pdf 檔) 上傳。'
                          : thread.file_type === 'Curriculum_Analysis'
                            ? '請填好這個 program 的 Curriculum Analysis，並在這討論串夾帶該檔案 (通常為 .xls, xlsm, .pdf 檔) 上傳。'
                            : '-'}
                </Typography>
            )}
        </Box>
    );
};

const RequirementsBlock = ({ thread, template_obj }) => {
    const { user } = useAuth();
    return (
        <Box>
            <Box sx={{ display: 'flex' }}>
                <Typography fontWeight="bold" variant="body1">
                    {i18next.t('Requirements')}:
                </Typography>
                &nbsp;
                {is_TaiGer_AdminAgent(user) && thread.program_id ? (
                    <Link
                        component={LinkDom}
                        target="_blank"
                        to={`${DEMO.SINGLE_PROGRAM_LINK(
                            thread.program_id._id.toString()
                        )}`}
                        underline="hover"
                    >
                        [
                        {i18next.t('Update', {
                            ns: 'common'
                        })}
                        ]
                    </Link>
                ) : null}
            </Box>
            <Box>
                {thread.program_id ? (
                    <LinkableNewlineText text={getRequirement(thread)} />
                ) : thread.file_type === 'CV' ? (
                    <>
                        <Typography>
                            {i18next.t('cv-requirements-1', {
                                ns: 'cvmlrl'
                            })}
                            {` `}
                            <b>
                                {i18next.t('cv-requirements-1.1', {
                                    ns: 'cvmlrl'
                                })}
                            </b>
                        </Typography>
                        <Typography>
                            {i18next.t('cv-requirements-2', {
                                ns: 'cvmlrl'
                            })}
                        </Typography>
                        <Typography>
                            {i18next.t('cv-reminder-1', {
                                ns: 'cvmlrl'
                            })}
                        </Typography>
                        <Typography>
                            {i18next.t('cv-reminder-2', {
                                ns: 'cvmlrl'
                            })}
                        </Typography>
                    </>
                ) : template_obj?.prop.includes('RL') ||
                  template_obj?.alias.includes('Recommendation') ? (
                    <Typography>
                        {i18next.t('rl-requirements-1', {
                            ns: 'cvmlrl'
                        })}
                    </Typography>
                ) : (
                    <Typography>
                        {i18next.t('No', {
                            ns: 'common'
                        })}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

const InformationBlock = ({
    agents,
    deadline,
    editors,
    conflict_list,
    documentsthreadId,
    isFavorite,
    template_obj,
    widths,
    startEditingEditor,
    handleFavoriteToggle,
    thread,
    user
}) => {
    return (
        <Card sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid item md={widths[0]}>
                    <Stack alignItems="center" direction="row">
                        <Typography fontWeight="bold" variant="h6">
                            {i18next.t('Instructions')}
                        </Typography>
                        <IconButton
                            onClick={() => handleFavoriteToggle(thread._id)}
                        >
                            {isFavorite ? (
                                <StarRoundedIcon />
                            ) : (
                                <StarBorderRoundedIcon />
                            )}
                        </IconButton>
                    </Stack>
                    <DescriptionBlock
                        documentsthreadId={documentsthreadId}
                        template_obj={template_obj}
                        thread={thread}
                    />
                    <RequirementsBlock
                        template_obj={template_obj}
                        thread={thread}
                    />
                </Grid>
                <Grid item md={widths[1]}>
                    <Typography fontWeight="bold" variant="body1">
                        {i18next.t('Agent', { ns: 'common' })}:
                    </Typography>
                    {agents.map((agent, i) => (
                        <Typography key={i}>
                            {is_TaiGer_role(user) ? (
                                <Link
                                    component={LinkDom}
                                    target="_blank"
                                    to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
                                    underline="hover"
                                >
                                    {agent.firstname} {agent.lastname}
                                </Link>
                            ) : (
                                <>
                                    {agent.firstname} {agent.lastname}
                                </>
                            )}
                        </Typography>
                    ))}
                    <Typography fontWeight="bold" variant="body1">
                        {thread.file_type === 'Essay'
                            ? i18next.t('Essay Writer', {
                                  ns: 'common'
                              })
                            : i18next.t('Editor', { ns: 'common' })}
                        :
                    </Typography>
                    {[
                        ...AGENT_SUPPORT_DOCUMENTS_A,
                        FILE_TYPE_E.essay_required
                    ].includes(thread.file_type) ? (
                        thread?.outsourced_user_id?.length > 0 ? (
                            thread?.outsourced_user_id?.map((outsourcer) => (
                                <Typography key={outsourcer._id}>
                                    {is_TaiGer_role(user) ? (
                                        <Link
                                            component={LinkDom}
                                            target="_blank"
                                            to={`${DEMO.TEAM_EDITOR_LINK(
                                                outsourcer._id.toString()
                                            )}`}
                                            underline="hover"
                                        >
                                            {outsourcer.firstname}{' '}
                                            {outsourcer.lastname}
                                        </Link>
                                    ) : (
                                        <>
                                            {outsourcer.firstname}{' '}
                                            {outsourcer.lastname}
                                        </>
                                    )}
                                </Typography>
                            ))
                        ) : (
                            <Typography>
                                {[...AGENT_SUPPORT_DOCUMENTS_A].includes(
                                    thread.file_type
                                )
                                    ? 'If needed, editor can be added'
                                    : 'To Be Assigned'}
                            </Typography>
                        )
                    ) : null}
                    {![
                        ...AGENT_SUPPORT_DOCUMENTS_A,
                        FILE_TYPE_E.essay_required
                    ].includes(thread.file_type)
                        ? editors.map((editor, i) => (
                              <Typography key={i}>
                                  {is_TaiGer_role(user) ? (
                                      <Link
                                          component={LinkDom}
                                          target="_blank"
                                          to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
                                          underline="hover"
                                      >
                                          {editor.firstname} {editor.lastname}
                                      </Link>
                                  ) : (
                                      <>
                                          {editor.firstname} {editor.lastname}
                                      </>
                                  )}
                              </Typography>
                          ))
                        : null}
                    {is_TaiGer_role(user) &&
                    [
                        ...AGENT_SUPPORT_DOCUMENTS_A,
                        FILE_TYPE_E.essay_required
                    ].includes(thread.file_type) ? (
                        <Button
                            color="primary"
                            onClick={startEditingEditor}
                            size="small"
                            variant="contained"
                        >
                            {thread.file_type === 'Essay'
                                ? i18next.t('Add Essay Writer')
                                : i18next.t('Add Editor')}
                        </Button>
                    ) : null}
                    {thread.program_id ? (
                        <>
                            <Typography fontWeight="bold" variant="body1">
                                {i18next.t('Semester', {
                                    ns: 'common'
                                })}
                                :
                            </Typography>
                            <Typography>
                                {thread.program_id.semester}
                            </Typography>
                            <Typography fontWeight="bold" variant="body1">
                                {i18next.t('Program Language', {
                                    ns: 'common'
                                })}
                                :
                            </Typography>
                            <Typography>{thread.program_id.lang}</Typography>
                        </>
                    ) : null}

                    <Typography variant="body1">
                        <b>{i18next.t('Deadline', { ns: 'common' })}:</b>
                        {is_TaiGer_AdminAgent(user) && thread.program_id ? (
                            <Link
                                component={LinkDom}
                                target="_blank"
                                to={`${DEMO.SINGLE_PROGRAM_LINK(
                                    thread.program_id._id.toString()
                                )}`}
                                underline="hover"
                            >
                                {' '}
                                [Update]
                            </Link>
                        ) : null}
                    </Typography>
                    <Typography variant="string">{deadline}</Typography>
                </Grid>
                {thread.file_type === 'CV' ? (
                    <Grid item md={widths[2]}>
                        <Typography variant="h6">
                            <b>Profile photo:</b>
                            <img
                                height="100%"
                                src={`${BASE_URL}/api/students/${thread.student_id._id}/files/Passport_Photo`}
                                width="100%"
                            />
                        </Typography>
                        <Typography>
                            If image not shown, please go to{' '}
                            <Link
                                component={LinkDom}
                                to="/base-documents"
                                underline="hover"
                            >
                                <b>My Documents</b>
                                <LaunchIcon fontSize="small" />
                            </Link>
                            and upload the Passport Photo.
                        </Typography>
                    </Grid>
                ) : (
                    !is_TaiGer_Student(user) && (
                        <Grid item md={widths[2]}>
                            <Typography variant="body1">
                                {i18next.t('Conflict')}:
                            </Typography>
                            {conflict_list.length === 0
                                ? 'None'
                                : conflict_list.map((conflict_student, j) => (
                                      <Typography key={j}>
                                          <LinkDom
                                              to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
                                                  conflict_student._id.toString(),
                                                  DEMO.CVMLRL_HASH
                                              )}`}
                                          >
                                              <b>
                                                  {conflict_student.firstname}{' '}
                                                  {conflict_student.lastname}
                                              </b>
                                          </LinkDom>
                                      </Typography>
                                  ))}
                        </Grid>
                    )
                )}
            </Grid>
        </Card>
    );
};

const DocModificationThreadPage = ({ threadId, isEmbedded = false }) => {
    const { user } = useAuth();
    const theme = useTheme();
    const { documentsthreadId: paramDocumentsthreadId } = useParams();
    const documentsthreadId = threadId || paramDocumentsthreadId;
    const [docModificationThreadPageState, setDocModificationThreadPageState] =
        useState({
            error: '',
            file: null,
            isLoaded: false,
            showEditorPage: false,
            isSubmissionLoaded: true,
            thread: null,
            buttonDisabled: false,
            editorState: {},
            expand: true,
            editors: [],
            agents: [],
            conflict_list: [],
            deadline: '',
            SetAsFinalFileModel: false,
            accordionKeys: [0], // to expand all]
            res_status: 0,
            res_modal_status: 0,
            res_modal_message: ''
        });
    const [checkResult, setCheckResult] = useState([]);
    const { hash } = useLocation();
    const [value, setValue] = useState(THREAD_TABS[hash.replace('#', '')] || 0);
    const [openOriginAuthorModal, setOpenOriginAuthorModal] = useState(false);
    const [originAuthorConfirmed, setOriginAuthorConfirmed] = useState(false);
    const [originAuthorCheckboxConfirmed, setOriginAuthorCheckboxConfirmed] =
        useState(false);
    const { data, error } = useQuery(getMessagThreadQuery(documentsthreadId));

    useEffect(() => {
        if (data) {
            const {
                success,
                data: threadData,
                editors,
                agents,
                threadAuditLog,
                deadline,
                conflict_list
            } = data.data;
            const { status } = data;

            if (success) {
                setOriginAuthorConfirmed(
                    threadData?.isOriginAuthorDeclarationConfirmedByStudent
                );

                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    success,
                    thread: threadData,
                    threadAuditLog,
                    editors,
                    agents,
                    deadline,
                    conflict_list,
                    isLoaded: true,
                    documentsthreadId: documentsthreadId,
                    file: null,
                    accordionKeys: new Array(threadData.messages.length)
                        .fill()
                        .map((x, i) =>
                            i === threadData.messages.length - 1 ? i : -1
                        ), // to collapse all
                    res_status: status
                }));
            } else {
                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    res_status: status
                }));
            }
        }

        if (error) {
            setDocModificationThreadPageState((prevState) => ({
                ...prevState,
                isLoaded: true,
                error,
                res_status: 500
            }));
        }
    }, [data, error]);

    const closeSetAsFinalFileModelWindow = () => {
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            SetAsFinalFileModel: false
        }));
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        window.location.hash = THREAD_REVERSED_TABS[newValue];
    };

    const onFileChange = (e) => {
        e.preventDefault();
        const file_num = e.target.files.length;
        if (file_num <= 3) {
            if (!e.target.files) {
                return;
            }
            if (!is_TaiGer_role(user)) {
                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    file: Array.from(e.target.files)
                }));
                return;
            }
            // Ensure a file is selected
            // TODO: make array
            const checkPromises = Array.from(e.target.files).map((file) => {
                const extension = file.name.split('.').pop().toLowerCase();
                const studentName =
                    docModificationThreadPageState.thread.student_id.firstname;

                if (extension === 'pdf') {
                    return readPDF(file, studentName);
                } else if (extension === 'docx') {
                    return readDOCX(file, studentName);
                } else if (extension === 'xlsx') {
                    return readXLSX(file, studentName);
                } else {
                    return Promise.resolve({});
                }
            });
            Promise.all(checkPromises)
                .then((results) => {
                    setCheckResult(results);
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        file: Array.from(e.target.files)
                    }));
                })
                .catch((error) => {
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        res_modal_message: error,
                        res_modal_status: 500
                    }));
                });
        } else {
            setDocModificationThreadPageState((prevState) => ({
                ...prevState,
                res_modal_message: 'You can only select up to 3 files.',
                res_modal_status: 423
            }));
        }
    };

    const ConfirmError = () => {
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };

    const singleExpandtHandler = (idx) => {
        let accordionKeys = [...docModificationThreadPageState.accordionKeys];
        accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            accordionKeys: accordionKeys
        }));
    };

    const AllCollapsetHandler = () => {
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            expand: false,
            accordionKeys: new Array(
                docModificationThreadPageState.thread.messages.length
            )
                .fill()
                .map(() => -1) // to collapse all]
        }));
    };

    const AllExpandtHandler = () => {
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            expand: true,
            accordionKeys: new Array(
                docModificationThreadPageState.thread.messages.length
            )
                .fill()
                .map((x, i) => i) // to expand all]
        }));
    };

    const postOriginAuthorConfirmed = (checked) => {
        setOriginAuthorConfirmed(checked);
        putOriginAuthorConfirmedByStudent(
            docModificationThreadPageState.documentsthreadId,
            docModificationThreadPageState.thread.student_id._id,
            originAuthorCheckboxConfirmed
        ).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        success,
                        thread: {
                            ...docModificationThreadPageState.thread,
                            isOriginAuthorDeclarationConfirmedByStudent: true
                        }
                    }));
                } else {
                    const { message } = resp.data;
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        buttonDisabled: false,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const handleClickSave = (e, editorState) => {
        e.preventDefault();
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            buttonDisabled: true
        }));
        var message = JSON.stringify(editorState);
        const formData = new FormData();

        if (docModificationThreadPageState.file) {
            docModificationThreadPageState.file.forEach((file) => {
                formData.append('files', file);
            });
        }

        formData.append('message', message);

        SubmitMessageWithAttachment(
            docModificationThreadPageState.documentsthreadId,
            docModificationThreadPageState.thread.student_id._id,
            formData
        ).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        success,
                        file: null,
                        editorState: {},
                        thread: {
                            ...docModificationThreadPageState.thread,
                            messages: data?.messages
                        },
                        isLoaded: true,
                        buttonDisabled: false,
                        accordionKeys: [
                            ...docModificationThreadPageState.accordionKeys,
                            data.messages.length - 1
                        ],
                        res_modal_status: status
                    }));
                } else {
                    // TODO: what if data is oversize? data type not match?
                    const { message } = resp.data;
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        buttonDisabled: false,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            in_edit_mode: false
        }));
    };

    // function generatePDF() {
    //     const doc = new jsPDF();

    //     // Styled text
    //     doc.setFont('times');
    //     // doc.setFontStyle('italic');
    //     doc.setFontSize(16);
    //     doc.text('Styled Text Content', 10, 20);

    //     // Timestamp
    //     const timestamp = new Date().toLocaleString();
    //     doc.setFontSize(12);
    //     doc.text(`Timestamp: ${timestamp}`, 10, 40);

    //     // Signature
    //     doc.setFontSize(14);
    //     doc.text('Signature:', 10, 60);

    //     // Output
    //     doc.save('document.pdf');
    // }

    const handleAsFinalFile = (doc_thread_id, student_id, program_id) => {
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            doc_thread_id,
            student_id,
            program_id,
            SetAsFinalFileModel: true
        }));
    };

    const ConfirmSetAsFinalFileHandler = (e) => {
        e.preventDefault();
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            isSubmissionLoaded: false // false to reload everything
        }));
        const temp_program_id = docModificationThreadPageState.program_id
            ? docModificationThreadPageState.program_id._id.toString()
            : undefined;
        SetFileAsFinal(
            docModificationThreadPageState.doc_thread_id,
            docModificationThreadPageState.student_id,
            temp_program_id
        ).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        isSubmissionLoaded: true,
                        thread: {
                            ...prevState.thread,
                            isFinalVersion: data.isFinalVersion,
                            updatedAt: data.updatedAt
                        },
                        success: success,
                        SetAsFinalFileModel: false,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        isSubmissionLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const onDeleteSingleMessage = (e, message_id) => {
        e.preventDefault();
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            isLoaded: false
        }));
        deleteAMessageInThread(
            docModificationThreadPageState.documentsthreadId,
            message_id
        ).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    // TODO: remove that message
                    var new_messages = [
                        ...docModificationThreadPageState.thread.messages
                    ];
                    let idx =
                        docModificationThreadPageState.thread.messages.findIndex(
                            (message) => message._id.toString() === message_id
                        );
                    if (idx !== -1) {
                        new_messages.splice(idx, 1);
                    }
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        success,
                        isLoaded: true,
                        thread: {
                            ...docModificationThreadPageState.thread,
                            messages: new_messages
                        },
                        buttonDisabled: false,
                        res_modal_status: status
                    }));
                } else {
                    // TODO: what if data is oversize? data type not match?
                    const { message } = resp.data;
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        buttonDisabled: false,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            in_edit_mode: false
        }));
    };

    const setEditorModalhide = () => {
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            showEditorPage: false
        }));
    };

    const startEditingEditor = () => {
        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            subpage: 2,
            showEditorPage: true
        }));
    };

    const submitUpdateEssayWriterlist = (
        e,
        updateEssayWriterList,
        essayDocumentThread_id
    ) => {
        e.preventDefault();
        setEditorModalhide();
        updateEssayWriter(updateEssayWriterList, essayDocumentThread_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    let essays_temp = {
                        ...docModificationThreadPageState.thread
                    };
                    essays_temp.outsourced_user_id = data.outsourced_user_id; // data is single student updated
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true, //false to reload everything
                        thread: essays_temp,
                        success: success,
                        updateEditorList: [],
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_message: message,
                        res_modal_status: status
                    }));
                }
            },
            (error) => {
                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_modal_status: 500,
                    res_modal_message: ''
                }));
            }
        );
    };

    const handleFavoriteToggle = (id) => {
        // Make sure flag_by_user_id is an array

        setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            thread: {
                ...prevState.thread,
                flag_by_user_id: toogleItemInArray(
                    docModificationThreadPageState.thread?.flag_by_user_id,
                    user._id.toString()
                )
            }
        }));
        putThreadFavorite(id).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (!success) {
                    setDocModificationThreadPageState((prevState) => ({
                        ...prevState,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setDocModificationThreadPageState((prevState) => ({
                    ...prevState,
                    error,
                    res_status: 500
                }));
            }
        );
    };

    const {
        isLoaded,
        isSubmissionLoaded,
        conflict_list,
        threadAuditLog,
        thread,
        res_status,
        res_modal_status,
        res_modal_message
    } = docModificationThreadPageState;

    if (!isLoaded || !thread) {
        return <Loading />;
    }

    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }
    let widths = [];
    if (thread.file_type === 'CV') {
        widths = [8, 2, 2];
    } else {
        if (is_TaiGer_Student(user)) {
            widths = [10, 2];
        } else {
            widths = [8, 2, 2];
        }
    }

    // Only CV, ML RL has instructions and template.
    let template_obj = templatelist.find(
        ({ prop, alias }) =>
            prop.includes(thread.file_type.split('_')[0]) ||
            alias.includes(thread.file_type.split('_')[0])
    );
    let docName;
    const student_name = `${thread.student_id.firstname} ${thread.student_id.lastname}`;
    const student_name_zh = `${thread.student_id.lastname_chinese}${thread.student_id.firstname_chinese}`;
    if (thread.program_id) {
        const { school, degree, program_name } = thread.program_id;
        docName = `${school} - ${degree} - ${program_name} ${thread.file_type}`;
    } else {
        docName = thread.file_type;
    }

    const isFavorite = thread.flag_by_user_id?.includes(user._id.toString());
    TabTitle(`${student_name} ${docName}`);
    return (
        <Box>
            {!isLoaded ? <Loading /> : null}
            {thread?.file_type === 'Essay' ? (
                <Box className="sticky-top">
                    <Stack alignItems="center" direction="row" spacing={1}>
                        {originAuthorConfirmed ? (
                            <>
                                <CheckCircleIcon
                                    size={18}
                                    style={{ color: green[500] }}
                                    title="Agree"
                                />
                                <Typography variant="body1">
                                    {i18next.t('confirmDocument', {
                                        ns: 'documents',
                                        studentName: student_name,
                                        studentNameZh: student_name_zh,
                                        docName
                                    })}
                                    <span
                                        onClick={() =>
                                            setOpenOriginAuthorModal(
                                                !openOriginAuthorModal
                                            )
                                        }
                                        style={{
                                            color: theme.palette.primary.main,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {i18next.t('Read More')}
                                    </span>
                                </Typography>
                            </>
                        ) : (
                            <>
                                <HelpIcon
                                    size={18}
                                    style={{ color: grey[400] }}
                                />
                                <Typography variant="body1">
                                    {i18next.t('notConfirmDocument', {
                                        ns: 'documents',
                                        studentName: student_name,
                                        studentNameZh: student_name_zh,
                                        docName
                                    })}
                                    &nbsp;
                                    <span
                                        onClick={() =>
                                            setOpenOriginAuthorModal(
                                                !openOriginAuthorModal
                                            )
                                        }
                                        style={{
                                            color: theme.palette.primary.main,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {i18next.t('Read More')}
                                    </span>
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Box>
            ) : null}
            {/* TODO */}
            {/* {false ? <button onClick={generatePDF}>Generate PDF</button> : null} */}
            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
            >
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
                                docModificationThreadPageState.thread.student_id._id.toString(),
                                DEMO.CVMLRL_HASH
                            )}`}
                            underline="hover"
                        >
                            {student_name}
                        </Link>
                        <Typography color="text.primary" variant="body1">
                            {docName}
                            {i18next.t('discussion-thread', { ns: 'common' })}
                        </Typography>
                        <span style={{ float: 'right' }}>
                            {docModificationThreadPageState.expand ? (
                                <Button
                                    color="secondary"
                                    onClick={() => AllCollapsetHandler()}
                                    size="small"
                                    variant="outlined"
                                >
                                    {i18next.t('Collapse')}
                                </Button>
                            ) : (
                                <Button
                                    color="secondary"
                                    onClick={() => AllExpandtHandler()}
                                    size="small"
                                    variant="outlined"
                                >
                                    {i18next.t('Expand')}
                                </Button>
                            )}
                        </span>
                    </Breadcrumbs>
                </Box>
                {!is_TaiGer_Student(user) ? (
                    <Box style={{ textAlign: 'left' }}>
                        <Button
                            color="primary"
                            component={LinkDom}
                            size="small"
                            to={
                                isEmbedded
                                    ? `/document-modification/${documentsthreadId}`
                                    : `/doc-communications/${documentsthreadId}`
                            }
                            variant="contained"
                        >
                            {i18next.t('Switch View', { ns: 'common' })}
                        </Button>
                    </Box>
                ) : null}
            </Box>
            {docModificationThreadPageState.thread.isFinalVersion ? (
                <TopBar />
            ) : null}
            <Tabs
                aria-label="basic tabs example"
                indicatorColor="primary"
                onChange={handleChange}
                scrollButtons="auto"
                value={value}
                variant="scrollable"
            >
                <Tab
                    label={i18next.t('discussion-thread', { ns: 'common' })}
                    {...a11yProps(value, 0)}
                    sx={{
                        fontWeight: value === 0 ? 'bold' : 'normal' // Bold for selected tab
                    }}
                />
                <Tab
                    label={i18next.t('files', { ns: 'common' })}
                    {...a11yProps(value, 1)}
                    sx={{
                        fontWeight: value === 1 ? 'bold' : 'normal' // Bold for selected tab
                    }}
                />
                <Tab
                    label={i18next.t('Audit', { ns: 'common' })}
                    {...a11yProps(value, 2)}
                    sx={{
                        fontWeight: value === 2 ? 'bold' : 'normal' // Bold for selected tab
                    }}
                />
            </Tabs>
            <CustomTabPanel index={0} value={value}>
                <InformationBlock
                    agents={docModificationThreadPageState.agents}
                    conflict_list={conflict_list}
                    deadline={docModificationThreadPageState.deadline}
                    documentsthreadId={documentsthreadId}
                    editors={docModificationThreadPageState.editors}
                    handleFavoriteToggle={handleFavoriteToggle}
                    isFavorite={isFavorite}
                    startEditingEditor={startEditingEditor}
                    template_obj={template_obj}
                    thread={docModificationThreadPageState.thread}
                    user={user}
                    widths={widths}
                />
                <MessageList
                    accordionKeys={docModificationThreadPageState.accordionKeys}
                    apiPrefix="/api/document-threads"
                    documentsthreadId={
                        docModificationThreadPageState.documentsthreadId
                    }
                    isLoaded={docModificationThreadPageState.isLoaded}
                    onDeleteSingleMessage={onDeleteSingleMessage}
                    singleExpandtHandler={singleExpandtHandler}
                    thread={thread}
                    user={user}
                />
                {user.archiv !== true ? (
                    <Card
                        sx={{
                            p: 2,
                            overflowWrap: 'break-word', // Add this line
                            maxWidth: window.innerWidth - 64,
                            marginTop: '1px',
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1
                            }
                        }}
                    >
                        {thread.isFinalVersion ? (
                            <Typography>{i18next.t('thread-close')}</Typography>
                        ) : (
                            <>
                                <Avatar
                                    {...stringAvatar(
                                        `${user.firstname} ${user.lastname}`
                                    )}
                                />
                                <Typography
                                    style={{ marginLeft: '10px', flex: 1 }}
                                    sx={{ mt: 1 }}
                                    variant="body1"
                                >
                                    <b>
                                        {user.firstname} {user.lastname}
                                    </b>
                                </Typography>
                                <DocThreadEditor
                                    buttonDisabled={
                                        docModificationThreadPageState.buttonDisabled
                                    }
                                    checkResult={checkResult}
                                    doc_title="docModificationThreadPageState.doc_title"
                                    editorState={
                                        docModificationThreadPageState.editorState
                                    }
                                    file={docModificationThreadPageState.file}
                                    handleClickSave={handleClickSave}
                                    onFileChange={onFileChange}
                                    thread={thread}
                                />
                            </>
                        )}
                    </Card>
                ) : (
                    <Card>
                        <Typography>
                            Your service is finished. Therefore, you are in read
                            only mode.
                        </Typography>
                    </Card>
                )}
                {is_TaiGer_role(user) ? (
                    !thread.isFinalVersion ? (
                        <Button
                            color="success"
                            fullWidth
                            onClick={() =>
                                handleAsFinalFile(
                                    thread._id,
                                    thread.student_id._id,
                                    thread.program_id,
                                    thread.isFinalVersion
                                )
                            }
                            sx={{ mt: 2 }}
                            variant="contained"
                        >
                            {isSubmissionLoaded ? (
                                i18next.t('Mark as finished')
                            ) : (
                                <CircularProgress />
                            )}
                        </Button>
                    ) : (
                        <Button
                            color="secondary"
                            fullWidth
                            onClick={() =>
                                handleAsFinalFile(
                                    thread._id,
                                    thread.student_id._id,
                                    thread.program_id,
                                    thread.isFinalVersion
                                )
                            }
                            sx={{ mt: 2 }}
                            variant="outlined"
                        >
                            {isSubmissionLoaded ? (
                                i18next.t('Mark as open')
                            ) : (
                                <CircularProgress />
                            )}
                        </Button>
                    )
                ) : null}
            </CustomTabPanel>
            <CustomTabPanel index={1} value={value}>
                Files Overview
                <FilesList
                    accordionKeys={docModificationThreadPageState.accordionKeys}
                    documentsthreadId={
                        docModificationThreadPageState.documentsthreadId
                    }
                    isLoaded={docModificationThreadPageState.isLoaded}
                    onDeleteSingleMessage={onDeleteSingleMessage}
                    singleExpandtHandler={singleExpandtHandler}
                    thread={thread}
                    user={user}
                />
            </CustomTabPanel>
            <CustomTabPanel index={2} value={value}>
                <Audit audit={threadAuditLog} />
            </CustomTabPanel>
            <Dialog
                aria-labelledby="modal-orginal-declaration"
                onClose={() => {}}
                open={
                    (thread.file_type === 'Essay' &&
                        is_TaiGer_Student(user) &&
                        !originAuthorConfirmed) ||
                    openOriginAuthorModal
                }
            >
                <DialogTitle>
                    {i18next.t('Warning', { ns: 'common' })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography sx={{ my: 2 }} variant="body1">
                            {i18next.t('hello-students', {
                                ns: 'common',
                                tenant: appConfig.companyName
                            })}
                        </Typography>
                        <Typography sx={{ my: 2 }} variant="body1">
                            {i18next.t(
                                'essay-responsibility-declaration-content',
                                {
                                    ns: 'common',
                                    tenant: appConfig.companyFullName
                                }
                            )}
                        </Typography>
                        <Typography sx={{ my: 2 }} variant="body1">
                            {i18next.t(
                                'essay-responsibility-declaration-signature',
                                {
                                    ns: 'common',
                                    tenant: appConfig.companyFullName
                                }
                            )}
                        </Typography>
                    </DialogContentText>
                    {is_TaiGer_Student(user) ? (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        originAuthorCheckboxConfirmed ||
                                        thread.isOriginAuthorDeclarationConfirmedByStudent
                                    }
                                    disabled={
                                        thread.isOriginAuthorDeclarationConfirmedByStudent
                                    }
                                    onChange={() =>
                                        setOriginAuthorCheckboxConfirmed(
                                            !originAuthorCheckboxConfirmed
                                        )
                                    }
                                />
                            }
                            label={`${i18next.t(
                                'i-declare-without-help-of-ai',
                                {
                                    ns: 'common',
                                    studentFullName: `${student_name} ${student_name_zh}`,
                                    docName: docName
                                }
                            )}`}
                            sx={{ my: 2 }}
                        />
                    ) : null}
                    <br />
                    {is_TaiGer_Student(user) ? (
                        thread?.isOriginAuthorDeclarationConfirmedByStudent ? (
                            <Button
                                color="primary"
                                fullWidth
                                onClick={() =>
                                    setOpenOriginAuthorModal(
                                        !openOriginAuthorModal
                                    )
                                }
                                sx={{ mr: 2 }}
                                variant="contained"
                            >
                                {i18next.t('Close', { ns: 'common' })}
                            </Button>
                        ) : (
                            <Button
                                color="primary"
                                disabled={!originAuthorCheckboxConfirmed}
                                fullWidth
                                onClick={() =>
                                    postOriginAuthorConfirmed(
                                        originAuthorCheckboxConfirmed
                                    )
                                }
                                sx={{ mr: 2 }}
                                variant="contained"
                            >
                                {isSubmissionLoaded ? (
                                    i18next.t('I Agree', { ns: 'common' })
                                ) : (
                                    <CircularProgress />
                                )}
                            </Button>
                        )
                    ) : (
                        <Button
                            color="primary"
                            fullWidth
                            onClick={() =>
                                setOpenOriginAuthorModal(!openOriginAuthorModal)
                            }
                            sx={{ mr: 2 }}
                            variant="contained"
                        >
                            {i18next.t('Close', { ns: 'common' })}
                        </Button>
                    )}
                </DialogContent>
            </Dialog>
            <DocumentCheckingResultModal
                docName={docName}
                file_type={thread.file_type}
                isFinalVersion={thread.isFinalVersion}
                onClose={closeSetAsFinalFileModelWindow}
                onConfirm={(e) => ConfirmSetAsFinalFileHandler(e)}
                open={docModificationThreadPageState.SetAsFinalFileModel}
                student_name={student_name}
                thread_id={thread._id}
                title={i18next.t('Warning', { ns: 'common' })}
            />
            {is_TaiGer_role(user) &&
            docModificationThreadPageState.showEditorPage ? (
                <EditEssayWritersSubpage
                    actor={
                        [FILE_TYPE_E.essay_required].includes(thread.file_type)
                            ? 'Essay Writer'
                            : 'Editor'
                    }
                    editors={docModificationThreadPageState.editors}
                    essayDocumentThread={thread}
                    onHide={setEditorModalhide}
                    setmodalhide={setEditorModalhide}
                    show={docModificationThreadPageState.showEditorPage}
                    submitUpdateEssayWriterlist={submitUpdateEssayWriterlist}
                />
            ) : null}
            {res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={res_modal_message}
                    res_modal_status={res_modal_status}
                />
            ) : null}
        </Box>
    );
};

export default DocModificationThreadPage;
