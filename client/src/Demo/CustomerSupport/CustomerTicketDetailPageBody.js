import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Link,
  Breadcrumbs,
  Typography,
  List,
  Paper,
  Grid,
  ListItemText,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';

function CustomerTicketDetailPageBody() {
  const { t } = useTranslation();

  const tickets = [
    {
      id: 1,
      requestNumber: 'SR#136354726',
      requestType: 'Refund Request',
      date: '20/01/2023',
      status: 'Inprocess'
    }
  ];

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
        <Typography color="text.primary">{'TICKET_NUMBER'}</Typography>
      </Breadcrumbs>
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
                  <Typography variant="h5" gutterBottom>
                    Ticket Information
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    When customers have problems, they open support tickets.
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" gutterBottom>
                Here is your most recent history
              </Typography>
              <List>
                {tickets.map((ticket) => (
                  <ListItemButton
                    component={LinkDom}
                    to={`/ticket/${ticket.id}`}
                    key={ticket.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)', // Change background color on hover
                        '& .MuiTypography-root': {
                          color: 'primary.main' // Change text color on hover
                        },
                        '& .MuiListItemText-primary': {
                          color: 'primary.main' // Change primary text color on hover
                        }
                      }
                    }}
                  >
                    <ListItemText
                      primary={ticket.requestNumber}
                      secondary={`${ticket.requestType} - ${ticket.date}`}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {ticket.status}
                    </Typography>
                  </ListItemButton>
                ))}
              </List>
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
                    booking, fill out the passenger information, and create a
                    PNR. Then click to order ticket.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>How can see ticket history by PNR?</Typography>
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
      </Box>
    </Box>
  );
}

export default CustomerTicketDetailPageBody;
