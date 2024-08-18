import React, { useEffect, useState } from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTranslation } from 'react-i18next';
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
  DialogActions
} from '@mui/material';
import { pdfjs } from 'react-pdf'; // Library for rendering PDFs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import DocThreadEditor from '../../../components/Message/DocThreadEditor';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { stringAvatar, templatelist } from '../../Utils/contants';
import {
  AGENT_SUPPORT_DOCUMENTS_A,
  FILE_TYPE_E,
  LinkableNewlineText,
  getRequirement,
  is_TaiGer_AdminAgent,
  is_TaiGer_Student,
  is_TaiGer_role,
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

function DocModificationThreadPage() {
  const { user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();
  const { documentsthreadId } = useParams();
  const [docModificationThreadPageState, setDocModificationThreadPageState] =
    useState({
      error: '',
      file: null,
      componentRef: React.createRef(),
      isLoaded: false,
      isFilesListOpen: false,
      showEditorPage: false,
      isSubmissionLoaded: true,
      articles: [],
      isEdit: false,
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
  const [openOriginAuthorModal, setOpenOriginAuthorModal] = useState(false);
  const [originAuthorConfirmed, setOriginAuthorConfirmed] = useState(false);
  const [originAuthorCheckboxConfirmed, setOriginAuthorCheckboxConfirmed] =
    useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getMessagThread(documentsthreadId);
        const { success, data, editors, agents, deadline, conflict_list } =
          resp.data;
        const { status } = resp;
        if (success) {
          setOriginAuthorConfirmed(
            data?.isOriginAuthorDeclarationConfirmedByStudent
          );

          setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            success,
            thread: data,
            editors,
            agents,
            deadline,
            conflict_list,
            isLoaded: true,
            documentsthreadId: documentsthreadId,
            file: null,
            // accordionKeys: new Array(data.messages.length)
            //   .fill()
            //   .map((x, i) => i) // to expand all
            accordionKeys: new Array(data.messages.length)
              .fill()
              .map((x, i) => (i === data.messages.length - 1 ? i : -1)), // to collapse all
            res_status: status
          }));
        } else {
          setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            isLoaded: true,
            res_status: status
          }));
        }
      } catch (error) {
        setDocModificationThreadPageState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_status: 500
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    fetchData();
  }, [documentsthreadId]);

  const closeSetAsFinalFileModelWindow = () => {
    setDocModificationThreadPageState((prevState) => ({
      ...prevState,
      SetAsFinalFileModel: false
    }));
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

  function generatePDF() {
    const doc = new jsPDF();

    // Styled text
    doc.setFont('times');
    // doc.setFontStyle('italic');
    doc.setFontSize(16);
    doc.text('Styled Text Content', 10, 20);

    // Timestamp
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(12);
    doc.text(`Timestamp: ${timestamp}`, 10, 40);

    // Signature
    doc.setFontSize(14);
    doc.text('Signature:', 10, 60);

    // Output
    doc.save('document.pdf');
  }

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
          let idx = docModificationThreadPageState.thread.messages.findIndex(
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

  const handleClickOutside = (event) => {
    if (
      docModificationThreadPageState.componentRef.current &&
      !docModificationThreadPageState.componentRef.current.contains(
        event.target
      )
    ) {
      // Clicked outside the component, trigger props.closed
      handleCloseFileList();
    }
  };

  const handleOpenFileList = () => {
    setDocModificationThreadPageState((prevState) => ({
      ...prevState,
      isFilesListOpen: true
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

  const handleCloseFileList = () => {
    setDocModificationThreadPageState((prevState) => ({
      ...prevState,
      isFilesListOpen: false
    }));
  };

  const {
    isLoaded,
    isFilesListOpen,
    isSubmissionLoaded,
    conflict_list,
    res_status,
    res_modal_status,
    res_modal_message
  } = docModificationThreadPageState;

  if (!isLoaded && !docModificationThreadPageState.thread) {
    return <Loading />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }
  let widths = [];
  if (docModificationThreadPageState.thread.file_type === 'CV') {
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
      prop.includes(
        docModificationThreadPageState.thread.file_type.split('_')[0]
      ) ||
      alias.includes(
        docModificationThreadPageState.thread.file_type.split('_')[0]
      )
  );
  let docName;
  const student_name = `${docModificationThreadPageState.thread.student_id.firstname} ${docModificationThreadPageState.thread.student_id.lastname}`;
  const student_name_zh = `${docModificationThreadPageState.thread.student_id.lastname_chinese}${docModificationThreadPageState.thread.student_id.firstname_chinese}`;
  if (docModificationThreadPageState.thread.program_id) {
    docName =
      docModificationThreadPageState.thread.program_id.school +
      '-(' +
      docModificationThreadPageState.thread.program_id.degree +
      ') ' +
      docModificationThreadPageState.thread.program_id.program_name +
      ' ' +
      docModificationThreadPageState.thread.file_type;
  } else {
    docName = docModificationThreadPageState.thread.file_type;
  }
  TabTitle(`${student_name} ${docName}`);
  return (
    <Box>
      {!isLoaded && <Loading />}
      {docModificationThreadPageState.thread?.file_type === 'Essay' &&
        (originAuthorConfirmed ? (
          <Box className="sticky-top">
            <Typography variant="body1">
              <CheckCircleIcon
                size={18}
                style={{ color: green[500] }}
                title="Agree"
              />
              &nbsp;
              {t('confirmDocument', {
                ns: 'documents',
                studentName: student_name,
                studentNameZh: student_name_zh,
                docName
              })}
              &nbsp;
              <span
                onClick={() => setOpenOriginAuthorModal(!openOriginAuthorModal)}
                style={{ color: theme.palette.primary.main, cursor: 'pointer' }}
              >
                {t('Read More')}
              </span>
            </Typography>
          </Box>
        ) : (
          <Box className="sticky-top">
            <Typography variant="body1">
              <HelpIcon size={18} style={{ color: grey[400] }} />
              &nbsp;
              {t('notConfirmDocument', {
                ns: 'documents',
                studentName: student_name,
                studentNameZh: student_name_zh,
                docName
              })}{' '}
              &nbsp;
              <span
                onClick={() => setOpenOriginAuthorModal(!openOriginAuthorModal)}
                style={{ color: theme.palette.primary.main, cursor: 'pointer' }}
              >
                {t('Read More')}
              </span>
            </Typography>
          </Box>
        ))}
      {/* TODO */}
      {false && <button onClick={generatePDF}>Generate PDF</button>}
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
          to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
            docModificationThreadPageState.thread.student_id._id.toString(),
            DEMO.CVMLRL_HASH
          )}`}
        >
          {student_name}
        </Link>
        <Typography variant="body1" color="text.primary">
          {docName}
          {' Discussion thread'}
        </Typography>
        <span style={{ float: 'right' }}>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={handleOpenFileList}
          >
            {t('View all Files')}
          </Button>
          {docModificationThreadPageState.expand ? (
            <Button
              color="secondary"
              variant="outlined"
              size="small"
              onClick={() => AllCollapsetHandler()}
            >
              {t('Collapse')}
            </Button>
          ) : (
            <Button
              color="secondary"
              variant="outlined"
              size="small"
              onClick={() => AllExpandtHandler()}
            >
              {t('Expand')}
            </Button>
          )}
        </span>
      </Breadcrumbs>
      <Dialog
        open={isFilesListOpen}
        onClose={handleCloseFileList}
        // ref={docModificationThreadPageState.componentRef}
      >
        <DialogTitle>Files Overview</DialogTitle>
        <DialogContent>
          <FilesList
            documentsthreadId={docModificationThreadPageState.documentsthreadId}
            accordionKeys={docModificationThreadPageState.accordionKeys}
            singleExpandtHandler={singleExpandtHandler}
            thread={docModificationThreadPageState.thread}
            isLoaded={docModificationThreadPageState.isLoaded}
            user={user}
            onDeleteSingleMessage={onDeleteSingleMessage}
          />
        </DialogContent>
      </Dialog>
      {docModificationThreadPageState.thread.isFinalVersion && <TopBar />}
      <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item md={widths[0]}>
            <Typography variant="h6" fontWeight="bold">
              {t('Instructions')}
              <IconButton
                onClick={() =>
                  handleFavoriteToggle(
                    docModificationThreadPageState.thread._id
                  )
                }
              >
                {docModificationThreadPageState.thread.flag_by_user_id?.includes(
                  user._id.toString()
                ) ? (
                  <StarRoundedIcon />
                ) : (
                  <StarBorderRoundedIcon />
                )}
              </IconButton>
            </Typography>
            {template_obj ? (
              <>
                <Typography variant="body1">
                  {docModificationThreadPageState.thread.file_type === 'CV'
                    ? t('cv-instructions', { ns: 'cvmlrl' })
                    : t(
                        `Please fill our ${appConfig.companyName} template and attach the filled template and reply in English in this discussion. Any process question`
                      )}
                  :
                </Typography>
                <LinkDom to={`${DEMO.CV_ML_RL_DOCS_LINK}`}>
                  <Button size="small" variant="contained" color="info">
                    {t('Read More')}
                  </Button>
                </LinkDom>
                <Typography variant="body1">
                  {t('Download template')}:{' '}
                  {template_obj ? (
                    template_obj.prop.includes('RL') ||
                    template_obj.alias.includes('Recommendation') ? (
                      <b>
                        {t('Professor')}：
                        <a
                          href={`${BASE_URL}/api/account/files/template/${'RL_academic_survey_lock'}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            startIcon={<DownloadIcon />}
                          >
                            {t('Download', { ns: 'common' })}
                          </Button>
                        </a>
                        {t('Supervisor')}：
                        <a
                          href={`${BASE_URL}/api/account/files/template/${`RL_employer_survey_lock`}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            startIcon={<DownloadIcon />}
                          >
                            {t('Download', { ns: 'common' })}
                          </Button>
                        </a>
                      </b>
                    ) : (
                      <b>
                        <a
                          href={`${BASE_URL}/api/account/files/template/${template_obj.prop}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            startIcon={<DownloadIcon />}
                          >
                            {t('Download', { ns: 'common' })}
                          </Button>
                        </a>
                        <br />
                        {is_TaiGer_role(user) && (
                          <>
                            <LinkDom
                              to={`${DEMO.DOCUMENT_MODIFICATION_INPUT_LINK(
                                docModificationThreadPageState.documentsthreadId
                              )}`}
                            >
                              <Button
                                color="secondary"
                                variant="contained"
                                sx={{ my: 2 }}
                              >
                                Editor Helper
                              </Button>
                            </LinkDom>
                          </>
                        )}
                      </b>
                    )
                  ) : (
                    <>Not available</>
                  )}
                </Typography>
              </>
            ) : (
              <>
                <Typography>
                  {docModificationThreadPageState.thread.file_type ===
                  'Portfolio'
                    ? 'Please upload the portfolio in Microsoft Word form here so that your Editor can help you for the text modification'
                    : docModificationThreadPageState.thread.file_type ===
                      'Supplementary_Form'
                    ? '請填好這個 program 的 Supplementory Form，並在這討論串夾帶該檔案 (通常為 .xls, xlsm, .pdf 檔) 上傳。'
                    : docModificationThreadPageState.thread.file_type ===
                      'Curriculum_Analysis'
                    ? '請填好這個 program 的 Curriculum Analysis，並在這討論串夾帶該檔案 (通常為 .xls, xlsm, .pdf 檔) 上傳。'
                    : '-'}
                </Typography>
              </>
            )}
            <Box sx={{ display: 'flex' }}>
              <Typography variant="body1" fontWeight="bold">
                {t('Requirements')}:
              </Typography>
              &nbsp;
              {is_TaiGer_AdminAgent(user) &&
                docModificationThreadPageState.thread.program_id && (
                  <Link
                    underline="hover"
                    to={`${DEMO.SINGLE_PROGRAM_LINK(
                      docModificationThreadPageState.thread.program_id._id.toString()
                    )}`}
                    component={LinkDom}
                    target="_blank"
                  >
                    [{t('Update', { ns: 'common' })}]
                  </Link>
                )}
            </Box>
            {docModificationThreadPageState.thread.program_id ? (
              <>
                <LinkableNewlineText
                  text={getRequirement(docModificationThreadPageState.thread)}
                />
              </>
            ) : (
              <>
                {docModificationThreadPageState.thread.file_type === 'CV' ? (
                  <>
                    <Typography>
                      {t('cv-requirements-1', { ns: 'cvmlrl' })}
                      {` `}
                      <b>{t('cv-requirements-1.1', { ns: 'cvmlrl' })}</b>
                    </Typography>
                    <Typography>
                      {t('cv-requirements-2', { ns: 'cvmlrl' })}
                    </Typography>
                    <Typography>
                      {t('cv-reminder-1', { ns: 'cvmlrl' })}
                    </Typography>
                    <Typography>
                      {t('cv-reminder-2', { ns: 'cvmlrl' })}
                    </Typography>
                  </>
                ) : template_obj?.prop.includes('RL') ||
                  template_obj?.alias.includes('Recommendation') ? (
                  <>
                    <Typography>
                      {t('rl-requirements-1', { ns: 'cvmlrl' })}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography>{t('No', { ns: 'common' })}</Typography>
                  </>
                )}
              </>
            )}
          </Grid>
          <Grid item md={widths[1]}>
            <Typography variant="body1" fontWeight="bold">
              {t('Agent', { ns: 'common' })}:
            </Typography>
            {docModificationThreadPageState.agents.map((agent, i) => (
              <Typography key={i}>
                {is_TaiGer_role(user) ? (
                  <Link
                    underline="hover"
                    component={LinkDom}
                    to={`${DEMO.TEAM_AGENT_LINK(agent._id.toString())}`}
                    target="_blank"
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
            <Typography variant="body1" fontWeight="bold">
              {docModificationThreadPageState.thread.file_type === 'Essay'
                ? t('Essay Writer', { ns: 'common' })
                : t('Editor', { ns: 'common' })}
              :
            </Typography>
            {[
              ...AGENT_SUPPORT_DOCUMENTS_A,
              FILE_TYPE_E.essay_required
            ].includes(docModificationThreadPageState.thread.file_type) &&
              (docModificationThreadPageState.thread?.outsourced_user_id
                ?.length > 0 ? (
                docModificationThreadPageState.thread?.outsourced_user_id?.map(
                  (outsourcer) => (
                    <Typography key={outsourcer._id}>
                      {is_TaiGer_role(user) ? (
                        <Link
                          underline="hover"
                          component={LinkDom}
                          to={`${DEMO.TEAM_EDITOR_LINK(
                            outsourcer._id.toString()
                          )}`}
                          target="_blank"
                        >
                          {outsourcer.firstname} {outsourcer.lastname}
                        </Link>
                      ) : (
                        <>
                          {outsourcer.firstname} {outsourcer.lastname}
                        </>
                      )}
                    </Typography>
                  )
                )
              ) : (
                <Typography>
                  {[...AGENT_SUPPORT_DOCUMENTS_A].includes(
                    docModificationThreadPageState.thread.file_type
                  )
                    ? 'If needed, editor can be added'
                    : 'To Be Assigned'}
                </Typography>
              ))}
            {![
              ...AGENT_SUPPORT_DOCUMENTS_A,
              FILE_TYPE_E.essay_required
            ].includes(docModificationThreadPageState.thread.file_type) &&
              docModificationThreadPageState.editors.map((editor, i) => (
                <Typography key={i}>
                  {is_TaiGer_role(user) ? (
                    <Link
                      underline="hover"
                      component={LinkDom}
                      to={`${DEMO.TEAM_EDITOR_LINK(editor._id.toString())}`}
                      target="_blank"
                    >
                      {editor.firstname} {editor.lastname}
                    </Link>
                  ) : (
                    <>
                      {editor.firstname} {editor.lastname}
                    </>
                  )}
                </Typography>
              ))}
            {is_TaiGer_role(user) &&
              [
                ...AGENT_SUPPORT_DOCUMENTS_A,
                FILE_TYPE_E.essay_required
              ].includes(docModificationThreadPageState.thread.file_type) && (
                <Button
                  size="small"
                  color="primary"
                  variant="contained"
                  onClick={startEditingEditor}
                >
                  {docModificationThreadPageState.thread.file_type === 'Essay'
                    ? t('Add Essay Writer')
                    : t('Add Editor')}
                </Button>
              )}
            {docModificationThreadPageState.thread.program_id && (
              <>
                <Typography variant="body1" fontWeight="bold">
                  {t('Semester', { ns: 'common' })}:
                </Typography>
                <Typography>
                  {docModificationThreadPageState.thread.program_id.semester}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {t('Program Language', { ns: 'common' })}:
                </Typography>
                <Typography>
                  {docModificationThreadPageState.thread.program_id.lang}
                </Typography>
              </>
            )}

            <Typography variant="body1">
              <b>{t('Deadline', { ns: 'common' })}:</b>
              {is_TaiGer_AdminAgent(user) &&
                docModificationThreadPageState.thread.program_id && (
                  <Link
                    underline="hover"
                    component={LinkDom}
                    to={`${DEMO.SINGLE_PROGRAM_LINK(
                      docModificationThreadPageState.thread.program_id._id.toString()
                    )}`}
                    target="_blank"
                  >
                    {' '}
                    [Update]
                  </Link>
                )}
            </Typography>
            <Typography variant="string">
              {docModificationThreadPageState.deadline}
            </Typography>
          </Grid>
          {docModificationThreadPageState.thread.file_type === 'CV' ? (
            <Grid item md={widths[2]}>
              <Typography variant="h6">
                <b>Profile photo:</b>
                <img
                  src={`${BASE_URL}/api/students/${docModificationThreadPageState.thread.student_id._id}/files/Passport_Photo`}
                  height="100%"
                  width="100%"
                />
              </Typography>
              <Typography>
                If image not shown, please go to{' '}
                <Link
                  underline="hover"
                  to="/base-documents"
                  component={LinkDom}
                >
                  <b>Base Documents</b>
                  <LaunchIcon fontSize="small" />
                </Link>
                and upload the Passport Photo.
              </Typography>
            </Grid>
          ) : (
            !is_TaiGer_Student(user) && (
              <Grid item md={widths[2]}>
                <Typography variant="body1">{t('Conflict')}:</Typography>
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
      <MessageList
        documentsthreadId={docModificationThreadPageState.documentsthreadId}
        accordionKeys={docModificationThreadPageState.accordionKeys}
        singleExpandtHandler={singleExpandtHandler}
        thread={docModificationThreadPageState.thread}
        isLoaded={docModificationThreadPageState.isLoaded}
        user={user}
        onDeleteSingleMessage={onDeleteSingleMessage}
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
          <Avatar {...stringAvatar(`${user.firstname} ${user.lastname}`)} />
          <Typography
            variant="body1"
            sx={{ mt: 1 }}
            style={{ marginLeft: '10px', flex: 1 }}
          >
            <b>
              {user.firstname} {user.lastname}
            </b>
          </Typography>
          {docModificationThreadPageState.thread.isFinalVersion ? (
            <Typography>This discussion thread is close.</Typography>
          ) : (
            <DocThreadEditor
              thread={docModificationThreadPageState.thread}
              buttonDisabled={docModificationThreadPageState.buttonDisabled}
              doc_title={'docModificationThreadPageState.doc_title'}
              editorState={docModificationThreadPageState.editorState}
              handleClickSave={handleClickSave}
              file={docModificationThreadPageState.file}
              onFileChange={onFileChange}
              checkResult={checkResult}
            />
          )}
        </Card>
      ) : (
        <Card>
          <Typography>
            Your service is finished. Therefore, you are in read only mode.
          </Typography>
        </Card>
      )}
      {is_TaiGer_role(user) &&
        (!docModificationThreadPageState.thread.isFinalVersion ? (
          <Button
            fullWidth
            variant="contained"
            color="success"
            onClick={() =>
              handleAsFinalFile(
                docModificationThreadPageState.thread._id,
                docModificationThreadPageState.thread.student_id._id,
                docModificationThreadPageState.thread.program_id,
                docModificationThreadPageState.thread.isFinalVersion
              )
            }
            sx={{ mt: 2 }}
          >
            {isSubmissionLoaded ? t('Mark as finished') : <CircularProgress />}
          </Button>
        ) : (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={() =>
              handleAsFinalFile(
                docModificationThreadPageState.thread._id,
                docModificationThreadPageState.thread.student_id._id,
                docModificationThreadPageState.thread.program_id,
                docModificationThreadPageState.thread.isFinalVersion
              )
            }
            sx={{ mt: 2 }}
          >
            {isSubmissionLoaded ? t('Mark as open') : <CircularProgress />}
          </Button>
        ))}
      <Dialog
        open={
          (docModificationThreadPageState.thread.file_type === 'Essay' &&
            is_TaiGer_Student(user) &&
            !originAuthorConfirmed) ||
          openOriginAuthorModal
        }
        onClose={() => {}}
        aria-labelledby="modal-orginal-declaration"
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {' '}
            <Typography variant="body1" sx={{ my: 2 }}>
              各位同學您好， <br />
              今年開始德國學校已大量使用人工智慧技術來檢測申請文件(小論文/大論文/作業等等的內容)。為了確保台德學生的權益，我們需要向大家說明幾項重要事情。我們協助您撰寫小論文的過程中，我們會提出明確的寫作建議，包括內容走向、文章結構和文獻使用等建議。我們的目標是指導您完成一篇具有高質量的文章，以符合學校的申請要求。
              在撰寫過程中，我們首先會對您的文章內容提出指導方向，但請注意，我們的指導僅限於內文走向架構以及撰寫大原則，並不包括「重寫」或「編譯」。且內容草稿完成後，我們的外籍顧問將進行第二階段的潤稿，我們外籍顧問僅對您的英文進行修改。在此步驟中，我們將專注於英文文法的修訂，而不涉及文字重組或整篇文章重新論述或全篇改寫。
              請放心，我們的英文編修過程將使用word文檔中的reviewing
              mode修訂功能，以便您隨時查看修訂情況。我們建議您仔細審閱每一處修訂，並自行決定是否接受或拒絕修訂。如果您勾選「接受」英文編修建議，代表學生已同意此建議並對編修後的內容全權負責。
              然而，請注意，儘管我們致力於提供最優質的服務，但我們無法保證學校或其他機構不會對您的文章提出抄襲或是使用人工智慧技術的質疑。若因為任何原因導致您的文章不符合學校的標準，本公司不對相關事件負責。
              感謝您對我們的信任和合作。如果您有任何疑問或需要進一步的幫助，請隨時與我們聯繫。我們期待與您共同完成優秀的小論文。
            </Typography>
            <Typography variant="body1">
              Dear TaiGer customers,
              <br />
              Recently, some universities in Germany have begun using artificial
              intelligence technology to assess the writing of essays. In order
              to ensure the cooperation agreement between TaiGer Consultancy Ltd
              and our students, we would like to highlight some important
              matters to our esteemed customers. Our goal is to guide you in
              producing a high-quality essay that meets your expectations and
              requirements. This process of assisting you in writing essays
              consists of 2 steps: 1. In the first step, we will provide
              profound suggestions on aspects such as content direction, essay
              structure, and academic writing style incl. use of references.
              However, please note that our guidance is limited to the direction
              of the content and overarching principles, and does not include
              rewriting or compilation. 2. After the completion of the essay,
              our foreign consultants will proceed to the second step, which
              involves editing the English text. During this step, we will focus
              on revising English grammar, without involving any text
              restructuring or complete rewriting. Rest assured, our English
              editing process will utilize the reviewing mode feature in Word
              documents, allowing you to track revisions at any time. We
              recommend carefully reviewing each revision and deciding whether
              to accept or reject them. We would be honored if you accept our
              professional English editing suggestions. Please be aware that
              while we strive to provide the highest quality service, we cannot
              guarantee that schools or other institutions will not raise
              objections regarding plagiarism or the use of artificial
              intelligence technology in your essay. If for any reason your
              essay does not meet the standards of the school, we cannot be held
              responsible, and we ask for your understanding. Thank you for your
              trust and cooperation. If you have any questions or need further
              assistance, please feel free to contact us. We look forward to
              working with you to produce outstanding essays. Sincerely, TaiGer
              Consultancy Ltd.
            </Typography>
          </DialogContentText>
          {is_TaiGer_Student(user) && (
            <FormControlLabel
              label={`我 (${student_name} ${student_name_zh}) 確認 ${docName} 這份文件皆無用 AI 輔助完成，我同意此條款並對編修後的內容全權負責。`}
              sx={{ my: 2 }}
              control={
                <Checkbox
                  checked={
                    originAuthorCheckboxConfirmed ||
                    docModificationThreadPageState.thread
                      .isOriginAuthorDeclarationConfirmedByStudent
                  }
                  disabled={
                    docModificationThreadPageState.thread
                      .isOriginAuthorDeclarationConfirmedByStudent
                  }
                  onChange={() =>
                    setOriginAuthorCheckboxConfirmed(
                      !originAuthorCheckboxConfirmed
                    )
                  }
                />
              }
            />
          )}
          <br />
          {is_TaiGer_Student(user) ? (
            docModificationThreadPageState.thread
              ?.isOriginAuthorDeclarationConfirmedByStudent ? (
              <Button
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => setOpenOriginAuthorModal(!openOriginAuthorModal)}
                sx={{ mr: 2 }}
              >
                {t('Close', { ns: 'common' })}
              </Button>
            ) : (
              <Button
                fullWidth
                color="primary"
                variant="contained"
                disabled={!originAuthorCheckboxConfirmed}
                onClick={() =>
                  postOriginAuthorConfirmed(originAuthorCheckboxConfirmed)
                }
                sx={{ mr: 2 }}
              >
                {isSubmissionLoaded ? (
                  t('I Agree', { ns: 'common' })
                ) : (
                  <CircularProgress />
                )}
              </Button>
            )
          ) : (
            <Button
              fullWidth
              color="primary"
              variant="contained"
              onClick={() => setOpenOriginAuthorModal(!openOriginAuthorModal)}
              sx={{ mr: 2 }}
            >
              {t('Close', { ns: 'common' })}
            </Button>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={docModificationThreadPageState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to set{' '}
            <b>
              {student_name} {docName}
            </b>{' '}
            as{' '}
            <b>
              {docModificationThreadPageState.thread.isFinalVersion
                ? 'open'
                : 'final'}
            </b>
            ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={!isLoaded || !isSubmissionLoaded}
            onClick={(e) => ConfirmSetAsFinalFileHandler(e)}
          >
            {isSubmissionLoaded ? (
              t('Yes', { ns: 'common' })
            ) : (
              <CircularProgress />
            )}
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={closeSetAsFinalFileModelWindow}
          >
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
      {is_TaiGer_role(user) &&
        docModificationThreadPageState.showEditorPage && (
          <EditEssayWritersSubpage
            show={docModificationThreadPageState.showEditorPage}
            onHide={setEditorModalhide}
            actor={
              [FILE_TYPE_E.essay_required].includes(
                docModificationThreadPageState.thread.file_type
              )
                ? 'Essay Writer'
                : 'Editor'
            }
            setmodalhide={setEditorModalhide}
            submitUpdateEssayWriterlist={submitUpdateEssayWriterlist}
            essayDocumentThread={docModificationThreadPageState.thread}
            editors={docModificationThreadPageState.editors}
          />
        )}
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
    </Box>
  );
}

export default DocModificationThreadPage;
