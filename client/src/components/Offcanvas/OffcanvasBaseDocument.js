import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const OffcanvasBaseDocument = ({
    baseDocsflagOffcanvasButtonDisable,
    docName,
    link,
    onChangeURL,
    onHide,
    open,
    updateDocLink
}) => {
    const { t } = useTranslation();
    return (
        <Dialog onClose={onHide} open={open}>
            <DialogTitle>{t('Edit', { ns: 'common' })}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Documentation Link for <b>{docName}</b>
                </DialogContentText>
                <TextField
                    defaultValue={link}
                    fullWidth
                    onChange={(e) => onChangeURL(e)}
                    placeholder="https://taigerconsultancy-portal.com/docs/search/12345678"
                    size="small"
                />
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={baseDocsflagOffcanvasButtonDisable}
                    onClick={(e) => updateDocLink(e)}
                    variant="contained"
                >
                    {t('Save', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OffcanvasBaseDocument;
