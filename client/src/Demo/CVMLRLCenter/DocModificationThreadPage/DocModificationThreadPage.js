import React, { useEffect, useState } from 'react';
import { Link as LinkDom, useParams } from 'react-router-dom';
import DownloadIcon from '@mui/icons-material/Download';
import { FiExternalLink } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import {
  Typography,
  Button,
  Card,
  Link,
  Box,
  CircularProgress,
  Grid,
  Breadcrumbs,
  Avatar
} from '@mui/material';
import { pdfjs } from 'react-pdf'; // Library for rendering PDFs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

import MessageList from './MessageList';
import DocThreadEditor from './DocThreadEditor';
import ErrorPage from '../../Utils/ErrorPage';
import ModalMain from '../../Utils/ModalHandler/ModalMain';
import { stringAvatar, templatelist } from '../../Utils/contants';
import {
  LinkableNewlineText,
  getRequirement,
  is_TaiGer_AdminAgent,
  is_TaiGer_Student,
  is_TaiGer_role
} from '../../Utils/checking-functions';
import { BASE_URL } from '../../../api/request';
import {
  SubmitMessageWithAttachment,
  getMessagThread,
  deleteAMessageInThread,
  SetFileAsFinal
} from '../../../api';
import { TabTitle } from '../../Utils/TabTitle';
import DEMO from '../../../store/constant';
import FilesList from './FilesList';
import { appConfig } from '../../../config';
import { useAuth } from '../../../components/AuthProvider';
import Loading from '../../../components/Loading/Loading';
import ModalNew from '../../../components/Modal';

function DocModificationThreadPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { documentsthreadId } = useParams();
  const [docModificationThreadPageState, setDocModificationThreadPageState] =
    useState({
      error: '',
      file: null,
      componentRef: React.createRef(),
      isLoaded: false,
      isFilesListOpen: false,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getMessagThread(documentsthreadId);
        const { success, data, editors, agents, deadline, conflict_list } =
          resp.data;
        const { status } = resp;
        if (success) {
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
      console.log('file changed!');
      if (!e.target.files) {
        console.log('file null!');
        return;
      }
      // Ensure a file is selected
      // TODO: make array
      const checkPromises = new Array(e.target.files?.length);
      for (let i = 0; i < e.target.files?.length; i++) {
        const fl = e.target.files[i];
        console.log(fl.name);
        const extension = fl.name?.split('.').pop().toLowerCase();

        const promise = new Promise((resolve, reject) => {
          if (extension === 'pdf') {
            const reader = new FileReader();
            reader.onload = async (event) => {
              const checkPoints = {
                corretFirstname: {
                  value: false,
                  text: 'Dectect same name in the document'
                }
              };
              const checkPoints_temp = Object.assign({}, checkPoints);
              console.log(checkPoints_temp);
              try {
                const content = event.target.result;
                const typedarray = new Uint8Array(content);
                const pdf = await pdfjs.getDocument(typedarray).promise;
                let text = '';
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                  const page = await pdf.getPage(pageNum);
                  const pageTextContent = await page.getTextContent();
                  pageTextContent.items.forEach((item) => {
                    text += item.str + ' ';
                  });
                }
                if (
                  text.includes(
                    docModificationThreadPageState.thread.student_id.firstname
                  )
                ) {
                  checkPoints_temp.corretFirstname.value = true;
                }
                checkPoints_temp.name = { text: extension };
                resolve(checkPoints_temp);
              } catch (error) {
                console.error('Error reading PDF file:', error);
                checkPoints_temp.error.value = true;
                checkPoints_temp.error.text = error;
                reject(checkPoints_temp);
              }
            };
            reader.readAsArrayBuffer(fl);
          } else if (extension === 'docx') {
            const checkPoints = {
              corretFirstname: {
                value: false,
                text: 'Dectect same name in the document'
              }
            };
            const checkPoints_temp2 = Object.assign({}, checkPoints);
            const reader = new FileReader();
            reader.onload = async (event) => {
              console.log(event.target.result);
              resolve(checkPoints_temp2);
            };
            reader.readAsArrayBuffer(fl);
          } else {
            const checkPoints = {
              corretFirstname: {
                value: false,
                text: 'Dectect same name in the document'
              }
            };
            const checkPoints_temp3 = Object.assign({}, checkPoints);
            const reader = new FileReader();
            reader.onload = async (event) => {
              console.log(event.target.result);
              resolve(checkPoints_temp3);
            };
            reader.readAsArrayBuffer(fl);
          }
        });
        checkPromises[i] = promise;
      }
      console.log(checkPromises);
      Promise.all(checkPromises)
        .then((results) => {
          console.log(results);
          setCheckResult(results);
          setDocModificationThreadPageState((prevState) => ({
            ...prevState,
            file: Array.from(e.target.files)
          }));
        })
        .catch((error) => {
          console.error('Error processing PDF files:', error);
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

    // formData.append('files', docModificationThreadPageState.file);
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
            thread: data,
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
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Typography variant="body1" color="text.primary">
          <Link
            underline="hover"
            color="inherit"
            component={LinkDom}
            to={`${DEMO.STUDENT_DATABASE_STUDENTID_LINK(
              docModificationThreadPageState.thread.student_id._id.toString(),
              DEMO.PROFILE_HASH
            )}`}
          >
            {student_name}
            {'   '}
            {docName}
            {' Discussion thread'}
            {'   '}
          </Link>
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
      <ModalNew
        open={isFilesListOpen}
        onClose={handleCloseFileList}
        // ref={docModificationThreadPageState.componentRef}
      >
        <Typography>Files Overview</Typography>
        <FilesList
          documentsthreadId={docModificationThreadPageState.documentsthreadId}
          accordionKeys={docModificationThreadPageState.accordionKeys}
          singleExpandtHandler={singleExpandtHandler}
          thread={docModificationThreadPageState.thread}
          isLoaded={docModificationThreadPageState.isLoaded}
          user={user}
          onDeleteSingleMessage={onDeleteSingleMessage}
        />
      </ModalNew>
      <Card></Card>
      {docModificationThreadPageState.thread.isFinalVersion && (
        <Card>
          <Typography>
            Status: <b>Close</b>
          </Typography>
        </Card>
      )}

      <Card sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item md={widths[0]}>
            <Typography>Instruction</Typography>
            {template_obj ? (
              <>
                <Typography variant="body1">
                  {t(
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
                            {t('Download')}
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
                            {t('Download')}
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
                            {t('Download')}
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
                    ? '請填好這個 program 的 Supplementory Form / Curriculum Analysis，並在這討論串夾帶該檔案 (通常為 .xls, xlsm, .pdf 檔) 上傳。'
                    : '-'}
                </Typography>
              </>
            )}
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {t('Requirements')}:
              </Typography>
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
                    [{t('Update')}]
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
              <Typography>{t('No', { ns: 'common' })}</Typography>
            )}
          </Grid>
          <Grid item md={widths[1]}>
            <Typography variant="body1" fontWeight="bold">
              {t('Agent')}:
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
              {t('Editor')}:
            </Typography>
            {docModificationThreadPageState.editors.map((editor, i) => (
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

            <Typography variant="body1">
              <b>{t('Deadline')}:</b>
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
              <h6>
                <b>Profile photo:</b>
                <img
                  // className="d-block w-100"
                  src={`${BASE_URL}/api/students/${docModificationThreadPageState.thread.student_id._id}/files/Passport_Photo`}
                  height="100%"
                  width="100%"
                />
              </h6>
              If image not shown, please go to{' '}
              <Link underline="hover" to="/base-documents" component={LinkDom}>
                <b>Base Documents</b>
                <FiExternalLink style={{ cursor: 'pointer' }} />
              </Link>
              and upload the Passport Photo.
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
      <ModalNew
        open={docModificationThreadPageState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography variant="h6">{t('Warning')}</Typography>
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
          <br />
          <br />
          <Button
            color="primary"
            variant="contained"
            disabled={!isLoaded || !isSubmissionLoaded}
            onClick={(e) => ConfirmSetAsFinalFileHandler(e)}
            sx={{ mr: 2 }}
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
        </Box>
      </ModalNew>
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
