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
  DialogActions
} from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { deleteAMessageinTicket, deleteComplaintsTicket } from '../../api';
import MessageList from '../../components/Message/MessageList';

function CustomerTicketDetailPageBody({ complaintTicket }) {
  const { t } = useTranslation();
  const [isDeleted, setIsDeleted] = useState(false);
  const [
    customerTicketDetailPageBodyState,
    setCustomerTicketDetailPageBodyState
  ] = useState({
    thread: complaintTicket,
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
