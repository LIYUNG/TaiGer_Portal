import React, { useState } from 'react';
import {
    Badge,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProgramReportModal = (props) => {
    const { t } = useTranslation();
    const [programReportModalState, setProgramReportModalState] = useState({
        description: ''
    });
    const handleChange = (e) => {
        setProgramReportModalState((prevState) => ({
            ...prevState,
            description: e.target.value
        }));
    };

    return (
        <Dialog onClose={props.setReportModalHideDelete} open={props.isReport}>
            <DialogTitle>Report</DialogTitle>
            <DialogContent>
                What information is inaccurate for {props.uni_name} -{' '}
                {props.program_name}?
                <TextField
                    fullWidth
                    inputProps={{ maxLength: 2000 }}
                    isInvalid={
                        programReportModalState.description?.length > 2000
                    }
                    minRows={10}
                    multiline
                    onChange={(e) => handleChange(e)}
                    placeholder="Deadline is wrong."
                    type="textarea"
                    value={programReportModalState.description || ''}
                />
                <Badge>
                    {programReportModalState.description?.length || 0}/{2000}
                </Badge>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={programReportModalState.description?.length === 0}
                    onClick={() =>
                        props.submitProgramReport(
                            props.program_id,
                            programReportModalState.description
                        )
                    }
                    variant="contained"
                >
                    {t('Create ticket', { ns: 'programList' })}
                </Button>
                <Button
                    color="secondary"
                    onClick={props.setReportModalHideDelete}
                    variant="outlined"
                >
                    {t('Close', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ProgramReportModal;
