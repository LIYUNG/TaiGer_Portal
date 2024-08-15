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
  Card
} from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import {
  deleteAMessageinTicket,
  deleteComplaintsTicket,
  submitMessageInTicketWithAttachment
} from '../../api';
import MessageList from '../../components/Message/MessageList';
import { stringAvatar } from '../Utils/contants';
import { useAuth } from '../../components/AuthProvider';
import DocThreadEditor from '../../components/Message/DocThreadEditor';
import {
  is_TaiGer_role,
  readDOCX,
  readPDF,
  readXLSX
} from '../Utils/checking-functions';

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
      // TODO: make array
      const checkPromises = Array.from(e.target.files).map((file) => {
        const extension = file.name.split('.').pop().toLowerCase();
        const studentName =
          customerTicketDetailPageBodyState.thread.student_id.firstname;

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
    console.log(editorState);
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

  const returnBack = () => {
    navigate(DEMO.CUSTOMER_CENTER_LINK);
  };

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
                      Ticket Deleted
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
                onClick={() => setOpen(true)}
              >
                Delete Ticket
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
                        Ticket Information
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {complaintTicket.description}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {t('Frequently Asked Questions', { ns: 'common' })}
                  </Typography>
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>How do tickets get issued?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        To issue a ticket, you go to the booking search, make a
                        booking, fill out the passenger information, and create
                        a PNR. Then click to order ticket.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>
                        How can see ticket history by PNR?
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        Details about viewing ticket history by PNR.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
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
                  <Typography>This discussion thread is close.</Typography>
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
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('Do you want to delete this ticket?', { ns: 'common' })}
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
