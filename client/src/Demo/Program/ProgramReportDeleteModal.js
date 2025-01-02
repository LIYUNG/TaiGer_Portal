import React, { useState } from 'react';
import {
    Badge,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function ProgramReportDeleteModal(props) {
    const [programReportDeleteModal, setProgramReportDeleteModalState] =
        useState({
            ticket: {},
            delete: ''
        });
    const { t } = useTranslation();
    const handleChange = (e) => {
        var temp_ticket = { ...programReportDeleteModal.ticket };
        temp_ticket[e.target.id] = e.target.value;
        setProgramReportDeleteModalState((prevState) => ({
            ...prevState,
            ticket: temp_ticket
        }));
    };

    const handleDeleteChange = (e) => {
        setProgramReportDeleteModalState((prevState) => ({
            ...prevState,
            delete: e.target.value
        }));
    };

    return (
        <Dialog
            open={props.isReportDelete}
            onClose={props.setReportDeleteModalHide}
            centered
        >
            <DialogTitle>
                {t('Delete ticket', { ns: 'programList' })}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to delelete {props.uni_name} -{' '}
                    {props.program_name} ticket?
                </DialogContentText>
                {t('Description', { ns: 'common' })}
                <TextField
                    fullWidth
                    type="textarea"
                    inputProps={{ maxLength: 2000 }}
                    multiline
                    minRows={4}
                    placeholder="Deadline is wrong."
                    defaultValue={props.ticket.description}
                    isInvalid={props.ticket.description?.length > 2000}
                    onChange={(e) => handleChange(e)}
                />
                <Badge>
                    {props.ticket.description?.length || 0}/{2000}
                </Badge>
                <DialogContentText>
                    {t('Feedback', { ns: 'common' })}
                </DialogContentText>
                <TextField
                    fullWidth
                    type="textarea"
                    inputProps={{ maxLength: 2000 }}
                    multiline
                    minRows={4}
                    placeholder="Deadline is wrong."
                    defaultValue={props.ticket.feedback}
                    isInvalid={props.ticket.feedback?.length > 2000}
                    onChange={(e) => handleChange(e)}
                />
                <Badge>
                    {props.ticket.feedback?.length || 0}/{2000}
                </Badge>
                <DialogContentText>
                    Please enter <i>delete</i> in order to delete the ticket.
                </DialogContentText>
                <TextField
                    fullWidth
                    id="delete"
                    size="small"
                    type="text"
                    placeholder="delete"
                    onChange={(e) => handleDeleteChange(e)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    disabled={programReportDeleteModal.delete !== 'delete'}
                    onClick={() =>
                        props.submitProgramDeleteReport(
                            props.ticket._id.toString()
                        )
                    }
                >
                    {t('Delete ticket', { ns: 'programList' })}
                </Button>
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={props.setReportDeleteModalHide}
                >
                    {t('Close', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default ProgramReportDeleteModal;
