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
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { deleteComplaintsTicket } from '../../api';

function CustomerTicketDetailPageBody({ complaintTicket }) {
  const { t } = useTranslation();
  const [isDeleted, setIsDeleted] = useState(false);
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
            {complaintTicket?.messages?.map((message) => (
              <Card key={message._id}>
                <Typography variant="body1">
                  {message.user_id?.firstname}
                  {message.user_id?.lastname}
                </Typography>
                <Typography variant="bpdy2">{message.message}</Typography>
              </Card>
            ))}
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
