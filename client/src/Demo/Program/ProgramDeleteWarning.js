import React from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ProgramDeleteWarning = (props) => {
    const { t } = useTranslation();
    return (
        <Dialog
            aria-labelledby="contained-modal-title-vcenter"
            onClose={() => props.setDeleteProgramWarningOpen(false)}
            open={props.deleteProgramWarning}
        >
            <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Do you want to delete{' '}
                    <b>
                        {props.uni_name} - {props.program_name}?
                    </b>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={props.isPending}
                    onClick={() => props.RemoveProgramHandler(props.program_id)}
                    startIcon={
                        props.isPending ? <CircularProgress size={20} /> : null
                    }
                    variant="contained"
                >
                    {props.isPending
                        ? t('Deleting', { ns: 'common' })
                        : t('Yes', { ns: 'common' })}
                </Button>
                <Button
                    color="secondary"
                    onClick={() => props.setDeleteProgramWarningOpen(false)}
                    variant="outlined"
                >
                    {t('No', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default ProgramDeleteWarning;
