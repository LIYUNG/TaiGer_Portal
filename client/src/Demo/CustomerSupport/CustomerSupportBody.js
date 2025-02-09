import React from 'react';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import {
    Box,
    Link,
    Breadcrumbs,
    Typography,
    List,
    Paper,
    Grid,
    ListItemText,
    Button,
    ListItemButton,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { appConfig } from '../../config';
import DEMO from '../../store/constant';

import { convertDateUXFriendly } from '../../utils/contants';

const CustomerSupportBody = ({ complaintTickets }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleAddTicketClick = () => {
        navigate(DEMO.CUSTOMER_CENTER_ADD_TICKET_LINK);
    };

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
                <Typography color="text.primary">
                    {t('All Students', { ns: 'common' })}
                </Typography>
                <Typography color="text.primary">
                    {t('Customer Center', { ns: 'common' })}
                </Typography>
            </Breadcrumbs>
            <Box>
                <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                    my={2}
                >
                    <Box>
                        <Typography gutterBottom variant="h5">
                            {t('What is the purpose of the Customer Center?', {
                                ns: 'customerCenter'
                            })}
                        </Typography>
                        <Typography gutterBottom variant="subtitle1">
                            {t('explanation_customer_center', {
                                ns: 'customerCenter'
                            })}
                        </Typography>
                    </Box>
                    <Box alignItems="center" display="flex">
                        <Button
                            onClick={handleAddTicketClick}
                            startIcon={<AddIcon />}
                            sx={{ minWidth: '140px' }}
                            variant="contained"
                        >
                            {t('Add Ticket', { ns: 'customerCenter' })}
                        </Button>
                    </Box>
                </Box>
                <Grid container spacing={3}>
                    <Grid item md={8} xs={12}>
                        <Paper
                            elevation={3}
                            sx={{ p: 3, maxHeight: 600, overflow: 'auto' }}
                        >
                            <Box
                                alignItems="center"
                                display="flex"
                                justifyContent="space-between"
                                mb={2}
                            >
                                <Typography variant="h6">
                                    Latest Support History
                                </Typography>
                            </Box>
                            <Typography gutterBottom variant="body2">
                                Here is your most recent history
                            </Typography>
                            <List>
                                {complaintTickets.map((ticket) => (
                                    <ListItemButton
                                        component={LinkDom}
                                        key={ticket._id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor:
                                                    'rgba(0, 0, 0, 0.08)', // Change background color on hover
                                                '& .MuiTypography-root': {
                                                    color: 'primary.main' // Change text color on hover
                                                },
                                                '& .MuiListItemText-primary': {
                                                    color: 'primary.main' // Change primary text color on hover
                                                }
                                            }
                                        }}
                                        to={`${DEMO.CUSTOMER_CENTER_TICKET_DETAIL_PAGE_LINK(
                                            ticket._id
                                        )}`}
                                    >
                                        <ListItemText
                                            primary={`${ticket.title} - ${ticket.requester_id?.firstname}`}
                                            secondary={`${
                                                ticket.description
                                            } - ${convertDateUXFriendly(ticket.updatedAt)}`}
                                        />
                                        <Typography
                                            color="textSecondary"
                                            variant="body2"
                                        >
                                            {ticket.status}
                                        </Typography>
                                    </ListItemButton>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    <Grid item md={4} xs={12}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography gutterBottom variant="h6">
                                {t('Frequently Asked Questions', {
                                    ns: 'common'
                                })}
                            </Typography>
                            <Accordion disableGutters>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>
                                        {t(
                                            'What can I expect for the support ticket?',
                                            {
                                                ns: 'customerCenter'
                                            }
                                        )}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {t('expectation_customer_center', {
                                            ns: 'customerCenter'
                                        })}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion disableGutters>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>
                                        {t(
                                            'My Agent or Editor did not reply me immediately, what can I do?',
                                            {
                                                ns: 'customerCenter'
                                            }
                                        )}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {t('complaint_agents_editors', {
                                            ns: 'customerCenter',
                                            companyName: appConfig.companyName
                                        })}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion disableGutters>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    {t(
                                        'The quality of my CV, ML, RL or any other documents by the Editor is not as good as I expected. What can I do?',
                                        {
                                            ns: 'customerCenter'
                                        }
                                    )}
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {t('quality_cvmlrl_explanation', {
                                            ns: 'customerCenter'
                                        })}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default CustomerSupportBody;
