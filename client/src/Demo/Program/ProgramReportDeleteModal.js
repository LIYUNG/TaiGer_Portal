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

const ProgramReportDeleteModal = (props) => {
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
            centered
            onClose={props.setReportDeleteModalHide}
            open={props.isReportDelete}
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
                    defaultValue={props.ticket.description}
                    fullWidth
                    inputProps={{ maxLength: 2000 }}
                    isInvalid={props.ticket.description?.length > 2000}
                    minRows={4}
                    multiline
                    onChange={(e) => handleChange(e)}
                    placeholder="Deadline is wrong."
                    type="textarea"
                />
                <Badge>
                    {props.ticket.description?.length || 0}/{2000}
                </Badge>
                <DialogContentText>
                    {t('Feedback', { ns: 'common' })}
                </DialogContentText>
                <TextField
                    defaultValue={props.ticket.feedback}
                    fullWidth
                    inputProps={{ maxLength: 2000 }}
                    isInvalid={props.ticket.feedback?.length > 2000}
                    minRows={4}
                    multiline
                    onChange={(e) => handleChange(e)}
                    placeholder="Deadline is wrong."
                    type="textarea"
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
                    onChange={(e) => handleDeleteChange(e)}
                    placeholder="delete"
                    size="small"
                    type="text"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={programReportDeleteModal.delete !== 'delete'}
                    onClick={() =>
                        props.submitProgramDeleteReport(
                            props.ticket._id.toString()
                        )
                    }
                    variant="contained"
                >
                    {t('Delete ticket', { ns: 'programList' })}
                </Button>
                <Button
                    color="secondary"
                    onClick={props.setReportDeleteModalHide}
                    variant="outlined"
                >
                    {t('Close', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ProgramReportDeleteModal;
