import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CircularProgress,
    Grid,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
    is_TaiGer_AdminAgent,
    is_TaiGer_Editor,
    is_TaiGer_role
} from '@taiger-common/core';

import {
    createProgramReport,
    deleteProgramTicket,
    getProgramTicket,
    updateProgramTicket
} from '../../api';
import { convertDate } from '../../utils/contants';
import ErrorPage from '../Utils/ErrorPage';
import ProgramReportModal from './ProgramReportModal';
import { LinkableNewlineText } from '../Utils/checking-functions';
import ProgramReportUpdateModal from './ProgramReportUpdateModal';
import ModalMain from '../Utils/ModalHandler/ModalMain';
import ProgramReportDeleteModal from './ProgramReportDeleteModal';
import { useAuth } from '../../components/AuthProvider';

const ProgramReport = (props) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [programReportState, setProgramReportState] = useState({
        isReport: false,
        isReportDelete: false,
        isUpdateReport: false,
        description: '',
        isLoaded: false,
        tickets: [],
        ticket: {},
        res_status: 0,
        res_modal_message: '',
        res_modal_status: 0
    });

    useEffect(() => {
        getProgramTicket('program', props.program_id).then(
            (resp) => {
                const { data, success } = resp.data;
                const { status } = resp;
                if (success) {
                    setProgramReportState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        tickets: data,
                        success: success,
                        res_status: status
                    }));
                } else {
                    setProgramReportState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_status: status
                    }));
                }
            },
            (error) => {
                setProgramReportState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    error,
                    res_status: 500
                }));
            }
        );
    }, []);

    const handleReportClick = () => {
        setProgramReportState((prevState) => ({
            ...prevState,
            isReport: !prevState.isReport
        }));
    };

    const handleReportDeleteClick = (ticket) => {
        setProgramReportState((prevState) => ({
            ...prevState,
            isReportDelete: !programReportState.isReportDelete,
            ticket
        }));
    };

    const handleReportUpdateClick = (ticket) => {
        setProgramReportState((prevState) => ({
            ...prevState,
            isUpdateReport: !programReportState.isUpdateReport,
            ticket
        }));
    };

    const setReportModalHideDelete = () => {
        setProgramReportState((prevState) => ({
            ...prevState,
            isReport: false
        }));
    };

    const setReportDeleteModalHide = () => {
        setProgramReportState((prevState) => ({
            ...prevState,
            isReportDelete: false
        }));
    };

    const setReportUpdateModalHide = () => {
        setProgramReportState((prevState) => ({
            ...prevState,
            isUpdateReport: false
        }));
    };

    const submitProgramReport = (progrgam_id, description) => {
        createProgramReport(progrgam_id, description, 'program').then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    setProgramReportState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        isReport: false,
                        success: success,
                        tickets: [data, ...programReportState.tickets],
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setProgramReportState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        res_modal_status: status,
                        res_modal_message: message
                    }));
                }
            },
            (error) => {
                setProgramReportState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    isUpdateReport: false,
                    isReport: false,
                    res_modal_status: 500,
                    res_modal_message: error.message
                }));
            }
        );
    };

    const submitProgramUpdateReport = (ticket_id, updatedTicket) => {
        updateProgramTicket(ticket_id, updatedTicket).then(
            (resp) => {
                const { success, data } = resp.data;
                const { status } = resp;
                if (success) {
                    const temp_tickets = [...programReportState.tickets];
                    let temp_ticket_idx = temp_tickets.findIndex(
                        (temp_t) => temp_t._id.toString() === ticket_id
                    );
                    temp_tickets[temp_ticket_idx] = data;
                    setProgramReportState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        isUpdateReport: false,
                        isReport: false,
                        success: success,
                        tickets: temp_tickets,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setProgramReportState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        isUpdateReport: false,
                        isReport: false,
                        res_modal_status: status,
                        res_modal_message: message
                    }));
                }
            },
            (error) => {
                setProgramReportState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    isUpdateReport: false,
                    isReport: false,
                    res_modal_status: 500,
                    res_modal_message: error.message
                }));
            }
        );
    };

    const submitProgramDeleteReport = (ticket_id) => {
        deleteProgramTicket(ticket_id).then(
            (resp) => {
                const { success } = resp.data;
                const { status } = resp;
                if (success) {
                    const temp_tickets = programReportState.tickets.filter(
                        (ticket) => ticket._id.toString() !== ticket_id
                    );
                    setProgramReportState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        isReportDelete: false,
                        success: success,
                        tickets: temp_tickets,
                        res_modal_status: status
                    }));
                } else {
                    const { message } = resp.data;
                    setProgramReportState((prevState) => ({
                        ...prevState,
                        isLoaded: true,
                        isReportDelete: false,
                        res_modal_status: status,
                        res_modal_message: message
                    }));
                }
            },
            (error) => {
                setProgramReportState((prevState) => ({
                    ...prevState,
                    isLoaded: true,
                    isReportDelete: false,
                    res_modal_status: 500,
                    res_modal_message: error.message
                }));
            }
        );
    };

    const ConfirmError = () => {
        setProgramReportState((prevState) => ({
            ...prevState,
            res_modal_status: 0,
            res_modal_message: ''
        }));
    };
    const { res_status, isLoaded } = programReportState;
    if (res_status >= 400) {
        return <ErrorPage res_status={res_status} />;
    }
    if (!isLoaded) {
        return <CircularProgress />;
    }
    const tickets = programReportState.tickets.map((ticket, i) => (
        <Card key={i} sx={{ p: 2 }}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography>
                        <b>{t('Status at')}:</b> {ticket.status}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        <b>{t('Description', { ns: 'common' })}:</b>{' '}
                        <LinkableNewlineText text={ticket.description} />
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        <b>{t('Feedback at', { ns: 'common' })}:</b>
                        <LinkableNewlineText text={ticket.feedback} />
                    </Typography>
                </Grid>
                {is_TaiGer_AdminAgent(user) || is_TaiGer_Editor(user) ? (
                    <Grid item xs={12}>
                        <Typography>
                            {t('Reqested by')}:{' '}
                            {`${ticket.requester_id?.firstname} ${ticket.requester_id?.lastname}`}
                        </Typography>
                    </Grid>
                ) : null}
                <Grid item xs={12}>
                    <Typography>
                        {t('updated at')}: {convertDate(ticket.updatedAt)}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography>
                        {t('created at')}: {convertDate(ticket.createdAt)}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        color="primary"
                        onClick={() => handleReportUpdateClick(ticket)}
                        size="small"
                        variant="contained"
                    >
                        {t('Update', { ns: 'common' })}
                    </Button>
                    <Button
                        color="secondary"
                        disabled={
                            ticket.status === 'resolved' ||
                            (!is_TaiGer_role(user) &&
                                ticket.requester_id?.toString() !==
                                    user._id?.toString())
                        }
                        onClick={() => handleReportDeleteClick(ticket)}
                        size="small"
                        variant="contained"
                    >
                        {t('Delete', { ns: 'common' })}
                    </Button>
                </Grid>
            </Grid>
        </Card>
    ));
    return (
        <>
            <Button
                color="primary"
                onClick={() => handleReportClick()}
                size="small"
                variant="contained"
            >
                {t('Report', { ns: 'programList' })}
            </Button>
            {tickets}
            {programReportState.res_modal_status >= 400 ? (
                <ModalMain
                    ConfirmError={ConfirmError}
                    res_modal_message={programReportState.res_modal_message}
                    res_modal_status={programReportState.res_modal_status}
                />
            ) : null}
            <ProgramReportModal
                isReport={programReportState.isReport}
                program_id={props.program_id.toString()}
                program_name={props.program_name}
                setReportModalHideDelete={setReportModalHideDelete}
                submitProgramReport={submitProgramReport}
                uni_name={props.uni_name}
            />
            <ProgramReportDeleteModal
                isReportDelete={programReportState.isReportDelete}
                program_id={props.program_id.toString()}
                program_name={props.program_name}
                setReportDeleteModalHide={setReportDeleteModalHide}
                submitProgramDeleteReport={submitProgramDeleteReport}
                ticket={programReportState.ticket}
                uni_name={props.uni_name}
            />
            <ProgramReportUpdateModal
                isUpdateReport={programReportState.isUpdateReport}
                program_id={props.program_id.toString()}
                program_name={props.program_name}
                setReportUpdateModalHide={setReportUpdateModalHide}
                submitProgramUpdateReport={submitProgramUpdateReport}
                ticket={programReportState.ticket}
                uni_name={props.uni_name}
            />
        </>
    );
};
export default ProgramReport;
