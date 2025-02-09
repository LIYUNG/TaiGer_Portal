import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { is_TaiGer_role } from '@taiger-common/core';

import { useAuth } from '../../components/AuthProvider';

const ProgramReportUpdateModal = (props) => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [programReportUpdateModalState, ProgramReportUpdateModalState] =
        useState({
            ticket: props.ticket
        });
    useEffect(() => {
        ProgramReportUpdateModalState((prevState) => ({
            ...prevState,
            ticket: props.ticket
        }));
    }, [props.ticket]);

    const handleChange = (e) => {
        var temp_ticket = { ...programReportUpdateModalState.ticket };
        temp_ticket[e.target.name] = e.target.value;
        ProgramReportUpdateModalState((prevState) => ({
            ...prevState,
            ticket: temp_ticket
        }));
    };

    return (
        <Dialog
            onClose={props.setReportUpdateModalHide}
            open={props.isUpdateReport}
        >
            <DialogTitle>Report</DialogTitle>
            <DialogContent>
                What information is inaccurate for {props.uni_name} -{' '}
                {props.program_name}?{' '}
                <TextField
                    fullWidth
                    minRows={10}
                    multiline
                    name="description"
                    onChange={(e) => handleChange(e)}
                    placeholder="Deadline is wrong."
                    type="textarea"
                    value={programReportUpdateModalState.ticket.description}
                />
                <Typography variant="body1">Feedback</Typography>
                <TextField
                    defaultValue={programReportUpdateModalState.ticket.feedback}
                    fullWidth
                    minRows={10}
                    multiline
                    name="feedback"
                    onChange={(e) => handleChange(e)}
                    placeholder="Deadline is for Non-EU (05-15)"
                    type="textarea"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={!is_TaiGer_role(user)}
                    onClick={() =>
                        props.submitProgramUpdateReport(
                            props.ticket._id.toString(),
                            {
                                ...programReportUpdateModalState.ticket,
                                status: 'resolved'
                            }
                        )
                    }
                    sx={{ mr: 1 }}
                    variant="contained"
                >
                    {t('Resolve ticket', { ns: 'programList' })}
                </Button>
                <Button
                    color="secondary"
                    onClick={props.setReportUpdateModalHide}
                    variant="outlined"
                >
                    {t('Close', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ProgramReportUpdateModal;
