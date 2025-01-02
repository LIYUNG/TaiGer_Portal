import React, { useState } from 'react';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Link,
  Breadcrumbs,
  Typography,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Card,
  CircularProgress
} from '@mui/material';
import { is_TaiGer_role } from '@taiger-common/core';

import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import {
  deleteAMessageinTicket,
  deleteComplaintsTicket,
  submitMessageInTicketWithAttachment,
  updateComplaintsTicket
} from '../../api';
import MessageList from '../../components/Message/MessageList';
import { stringAvatar } from '../../utils/contants';
import { useAuth } from '../../components/AuthProvider';
import DocThreadEditor from '../../components/Message/DocThreadEditor';
import { readDOCX, readPDF, readXLSX } from '../Utils/checking-functions';
import { TopBar } from '../../components/TopBar/TopBar';

function CustomerTicketDetailPageBody({ complaintTicket }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [checkResult, setCheckResult] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [
    customerTicketDetailPageBodyState,
    setCustomerTicketDetailPageBodyState
  ] = useState({
    thread: complaintTicket,
    editorState: {},
    isSubmissionLoaded: true,
    accordionKeys: new Array(complaintTicket.messages.length)
      .fill()
      .map((x, i) => (i === complaintTicket.messages.length - 1 ? i : -1)), // to collapse all
    isLoaded: true
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDeleteTicketClick = async () => {
    const response = await deleteComplaintsTicket(
      complaintTicket?._id?.toString()
    );
    console.log(response);
    setIsDeleted(true);
    setOpen(false);
  };

  const singleExpandtHandler = (idx) => {
    let accordionKeys = [...customerTicketDetailPageBodyState.accordionKeys];
    accordionKeys[idx] = accordionKeys[idx] !== idx ? idx : -1;
    setCustomerTicketDetailPageBodyState((prevState) => ({
      ...prevState,
      accordionKeys: accordionKeys
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
        setCustomerTicketDetailPageBodyState((prevState) => ({
          ...prevState,
          file: Array.from(e.target.files)
        }));
        return;
      }
      // Ensure a file is selected
      const checkPromises = Array.from(e.target.files).map((file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        const studentName =
          customerTicketDetailPageBodyState.thread.requester_id.firstname;

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
          setCustomerTicketDetailPageBodyState((prevState) => ({
            ...prevState,
            file: Array.from(e.target.files)
          }));
        })
        .catch((error) => {
          setCustomerTicketDetailPageBodyState((prevState) => ({
            ...prevState,
            res_modal_message: error,
            res_modal_status: 500
          }));
        });
    } else {
      setCustomerTicketDetailPageBodyState((prevState) => ({
        ...prevState,
        res_modal_message: 'You can only select up to 3 files.',
        res_modal_status: 423
      }));
    }
  };

  const handleClickSave = (e, editorState) => {
    e.preventDefault();
    setCustomerTicketDetailPageBodyState((prevState) => ({
      ...prevState,
      buttonDisabled: true
    }));
    var message = JSON.stringify(editorState);
    const formData = new FormData();

    if (customerTicketDetailPageBodyState.file) {
      customerTicketDetailPageBodyState.file.forEach((file) => {
        formData.append('files', file);
      });
    }

    formData.append('message', message);

    submitMessageInTicketWithAttachment(
      customerTicketDetailPageBodyState.thread._id,
      customerTicketDetailPageBodyState.thread.requester_id._id,
      formData
    ).then(
      (resp) => {
        const { success, data } = resp.data;
        const { status } = resp;
        if (success) {
          setCustomerTicketDetailPageBodyState((prevState) => ({
            ...prevState,
            success,
            file: null,
            editorState: {},
            thread: {
              ...customerTicketDetailPageBodyState.thread,
              messages: data?.messages
            },
            isLoaded: true,
            buttonDisabled: false,
            accordionKeys: [
              ...customerTicketDetailPageBodyState.accordionKeys,
              data.messages.length - 1
            ],
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setCustomerTicketDetailPageBodyState((prevState) => ({
            ...prevState,
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCustomerTicketDetailPageBodyState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          buttonDisabled: false,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
    setCustomerTicketDetailPageBodyState((prevState) => ({
      ...prevState,
      in_edit_mode: false
    }));
  };

  const onDeleteSingleMessage = (e, message_id) => {
    e.preventDefault();
    setCustomerTicketDetailPageBodyState((prevState) => ({
      ...prevState,
      isLoaded: false
    }));
    deleteAMessageinTicket(complaintTicket?._id?.toString(), message_id).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          // TODO: remove that message
          var new_messages = [
            ...customerTicketDetailPageBodyState.thread.messages
          ];
          let idx = customerTicketDetailPageBodyState.thread.messages.findIndex(
            (message) => message._id.toString() === message_id
          );
          if (idx !== -1) {
            new_messages.splice(idx, 1);
          }
          setCustomerTicketDetailPageBodyState((prevState) => ({
            ...prevState,
            success,
            isLoaded: true,
            thread: {
              ...customerTicketDetailPageBodyState.thread,
              messages: new_messages
            },
            buttonDisabled: false,
            res_modal_status: status
          }));
        } else {
          // TODO: what if data is oversize? data type not match?
          const { message } = resp.data;
          setCustomerTicketDetailPageBodyState((prevState) => ({
            ...prevState,
            isLoaded: true,
            buttonDisabled: false,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCustomerTicketDetailPageBodyState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
    setCustomerTicketDetailPageBodyState((prevState) => ({
      ...prevState,
      in_edit_mode: false
    }));
  };

  const closeSetAsFinalFileModelWindow = () => {
    setCustomerTicketDetailPageBodyState((prevState) => ({
      ...prevState,
      SetAsFinalFileModel: false
    }));
  };

  const handleAsFinalFile = (ticket_id, newStatus) => {
    setCustomerTicketDetailPageBodyState((prevState) => ({
      ...prevState,
      ticket_id,
      newStatus,
      SetAsFinalFileModel: true
    }));
  };

  const ConfirmSetAsFinalFileHandler = (e) => {
    e.preventDefault();
    setCustomerTicketDetailPageBodyState((prevState) => ({
      ...prevState,
      isSubmissionLoaded: false // false to reload everything
    }));

    updateComplaintsTicket(
      customerTicketDetailPageBodyState.thread._id.toString(),
      { status: customerTicketDetailPageBodyState.newStatus }
    ).then(
      (resp) => {
        const { data, success } = resp.data;
        const { status } = resp;
        if (success) {
          setCustomerTicketDetailPageBodyState((prevState) => ({
            ...prevState,
            isSubmissionLoaded: true,
            thread: {
              ...prevState.thread,
              status: data.status
            },
            success: success,
            newStatus: '',
            SetAsFinalFileModel: false,
            res_modal_status: status
          }));
        } else {
          const { message } = resp.data;
          setCustomerTicketDetailPageBodyState((prevState) => ({
            ...prevState,
            isLoaded: true,
            isSubmissionLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          }));
        }
      },
      (error) => {
        setCustomerTicketDetailPageBodyState((prevState) => ({
          ...prevState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        }));
      }
    );
  };

  const returnBack = () => {
    navigate(DEMO.CUSTOMER_CENTER_LINK);
  };
  const { isLoaded, isSubmissionLoaded } = customerTicketDetailPageBodyState;

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
          to={`${DEMO.CUSTOMER_CENTER_LINK}`}
        >
          {t('Customer Center', { ns: 'common' })}
        </Link>
        <Typography color="text.primary">{`${complaintTicket.title} (Ticket Nr. ${complaintTicket._id})`}</Typography>
      </Breadcrumbs>
      {customerTicketDetailPageBodyState.thread.status === 'resolved' && (
        <TopBar />
      )}
      {isDeleted ? (
        <Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={12}>
              <Paper elevation={3} sx={{ p: 3, overflow: 'auto' }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="h5" gutterBottom>
                      {t('Ticket Deleted', {
                        ns: 'common'
                      })}
                    </Typography>
                    <Button variant="outlined" onClick={returnBack}>
                      {t('Back', { ns: 'common' })}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            my={2}
          >
            <Box></Box>
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                startIcon={<DeleteIcon />}
                disabled={
                  customerTicketDetailPageBodyState.thread.status === 'resolved'
                }
                onClick={() => setOpen(true)}
              >
                {t('Delete Ticket', { ns: 'common' })}
              </Button>
            </Box>
          </Box>
          <Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={8}>
                <Paper elevation={3} sx={{ p: 3, overflow: 'auto' }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {t('Description', {
                          ns: 'tickets'
                        })}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {complaintTicket.description}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {t('Requester', {
                          ns: 'tickets'
                        })}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {`${complaintTicket.requester_id?.firstname} ${complaintTicket.requester_id?.lastname}`}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {t('Frequently Asked Questions', {
                      ns: 'common'
                    })}
                  </Typography>
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>How can see issue ticket?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>Details about issuing tickets.</Typography>
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              </Grid>
            </Grid>
            <MessageList
              documentsthreadId={complaintTicket._id}
              accordionKeys={customerTicketDetailPageBodyState.accordionKeys}
              singleExpandtHandler={singleExpandtHandler}
              thread={customerTicketDetailPageBodyState.thread}
              isLoaded={customerTicketDetailPageBodyState.isLoaded}
              onDeleteSingleMessage={onDeleteSingleMessage}
              apiPrefix={'/api/complaints'}
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
                <Avatar
                  {...stringAvatar(`${user.firstname} ${user.lastname}`)}
                />
                <Typography
                  variant="body1"
                  sx={{ mt: 1 }}
                  style={{ marginLeft: '10px', flex: 1 }}
                >
                  <b>
                    {user.firstname} {user.lastname}
                  </b>
                </Typography>
                {customerTicketDetailPageBodyState.thread.isFinalVersion ? (
                  <Typography>This ticket is resolved.</Typography>
                ) : (
                  <DocThreadEditor
                    thread={customerTicketDetailPageBodyState.thread}
                    buttonDisabled={
                      customerTicketDetailPageBodyState.buttonDisabled
                    }
                    doc_title={'customerTicketDetailPageBodyState.doc_title'}
                    editorState={customerTicketDetailPageBodyState.editorState}
                    handleClickSave={handleClickSave}
                    file={customerTicketDetailPageBodyState.file}
                    onFileChange={onFileChange}
                    checkResult={checkResult}
                  />
                )}
              </Card>
            ) : (
              <Card>
                <Typography>
                  Your service is finished. Therefore, you are in read only
                  mode.
                </Typography>
              </Card>
            )}
            {is_TaiGer_role(user) &&
              (customerTicketDetailPageBodyState.thread.status === 'open' ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() =>
                    handleAsFinalFile(
                      customerTicketDetailPageBodyState.thread._id,
                      'resolved'
                    )
                  }
                  sx={{ mt: 2 }}
                >
                  {isSubmissionLoaded ? (
                    t('Mark as finished')
                  ) : (
                    <CircularProgress />
                  )}
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={() =>
                    handleAsFinalFile(
                      customerTicketDetailPageBodyState.thread._id,
                      'open'
                    )
                  }
                  sx={{ mt: 2 }}
                >
                  {isSubmissionLoaded ? (
                    t('Mark as open')
                  ) : (
                    <CircularProgress />
                  )}
                </Button>
              ))}
          </Box>
        </Box>
      )}
      <Dialog
        open={customerTicketDetailPageBodyState.SetAsFinalFileModel}
        onClose={closeSetAsFinalFileModelWindow}
      >
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to set the ticket as{' '}
            <b>
              {customerTicketDetailPageBodyState.thread.isFinalVersion
                ? 'open'
                : 'resolved'}
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
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Do you want to delete this ticket?', {
              ns: 'tickets'
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteTicketClick}
          >
            {t('Yes', { ns: 'common' })}
          </Button>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            {t('No', { ns: 'common' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomerTicketDetailPageBody;
