import React from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  Box,
  Link,
  Breadcrumbs,
  Typography,
  //   Container,
  //   Tabs,
  //   Tab,
  List,
  Paper,
  Grid,
  //   ListItem,
  ListItemText,
  Button,
  //   FormControl,
  //   InputLabel,
  //   Select,
  //   MenuItem,
  //   TextField,
  ListItemButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { useTranslation } from 'react-i18next';
// import { DatePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import SearchIcon from '@mui/icons-material/Search';
import ExportIcon from '@mui/icons-material/ExitToApp';
// import CreateComplaintTicket from './CreateComplaintTicket';
// import ViewTickets from './ViewTickets';

function CustomerSupportBody() {
  const { t } = useTranslation();
  //   const [ticket, setTicket] = useState({
  //     requestType: '',
  //     pnr: '',
  //     passengerName: '',
  //     ticketNumber: '',
  //     reissueReason: '',
  //     changeDate: new Date(),
  //     flightNumber: '',
  //     remarks: ''
  //   });

  const tickets = [
    {
      id: 1,
      requestNumber: 'SR#136354726',
      requestType: 'Refund Request',
      date: '20/01/2023',
      status: 'Inprocess'
    },
    {
      id: 2,
      requestNumber: 'SR#136354745',
      requestType: 'Reissue Request',
      date: '25/01/2023',
      status: 'Approve'
    },
    {
      id: 3,
      requestNumber: 'SR#136354787',
      requestType: 'VIP Request',
      date: '23/01/2023',
      status: 'Submit'
    },
    {
      id: 4,
      requestNumber: 'SR#136354756',
      requestType: 'Void Request',
      date: '23/01/2023',
      status: 'Cancel'
    },
    {
      id: 5,
      requestNumber: 'SR#136354756',
      requestType: 'Void Request',
      date: '23/01/2023',
      status: 'Cancel'
    },
    {
      id: 6,
      requestNumber: 'SR#136354756',
      requestType: 'Void Request',
      date: '23/01/2023',
      status: 'Cancel'
    }
  ];

  //   const handleChange = (e) => {
  //     setTicket({ ...ticket, [e.target.name]: e.target.value });
  //   };

  //   const handleDateChange = (date) => {
  //     setTicket({ ...ticket, changeDate: date });
  //   };

  //   const handleSubmit = () => {
  //     // handle submit logic
  //   };

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
        <Typography color="text.primary">
          {t('Customer Center', { ns: 'common' })}
        </Typography>
      </Breadcrumbs>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          my={2}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              Support Ticket
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              When customers have problems, they open support tickets.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              sx={{ mr: 2 }}
            >
              Search
            </Button>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Ticket
            </Button>
          </Box>
        </Box>
        <Grid container spacing={3}>
          {/* <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Create New Ticket
              </Typography>
              <Typography variant="body2" gutterBottom>
                Fill up all the information here, then click submit button
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControl size="small" fullWidth margin="normal">
                    <InputLabel>Select Request Type</InputLabel>
                    <Select
                      value={ticket.requestType}
                      name="requestType"
                      onChange={handleChange}
                    >
                      <MenuItem value="Reissue Request">
                        Reissue Request
                      </MenuItem>
                      <MenuItem value="Refund Request">Refund Request</MenuItem>
                      <MenuItem value="VIP Request">VIP Request</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Search PNR"
                    name="pnr"
                    value={ticket.pnr}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      endAdornment: <SearchIcon />
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Flight Number"
                    name="flightNumber"
                    value={ticket.flightNumber}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Remarks"
                    name="remarks"
                    value={ticket.remarks}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Submit Ticket
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid> */}

          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{ p: 3, maxHeight: 600, overflow: 'auto' }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Latest Support History</Typography>
                <Button startIcon={<ExportIcon />}>Export</Button>
              </Box>
              <Typography variant="body2" gutterBottom>
                Here is your most recent history
              </Typography>
              <List>
                {tickets.map((ticket) => (
                  <ListItemButton
                    component={LinkDom}
                    to={`${DEMO.CUSTOMER_CENTER_TICKET_DETAIL_PAGE_LINK(
                      ticket.id
                    )}`}
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
                  <Typography>
                    What is the purpose of the Customer Center?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>TODO: </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    What can I expect for the support ticket?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>TODO: </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>The portal looks buggy, how can I do?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>TODO: </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    My Agent or Editor did not reply me, what can I do?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>TODO: </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    The quality of my CV, ML, RL or any other documents by the
                    Editor is not as good as I expected. What can I do?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>TODO: </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    I did not find my previous closed documents, how can I do?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>TODO: </Typography>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default CustomerSupportBody;
