import React from 'react';
import {
    Button,
    CircularProgress,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function UserDeleteWarning(props) {
    const { t } = useTranslation();
    return (
        <Dialog
            open={props.deleteUserWarning}
            onClose={props.setModalHideDDelete}
        >
            <DialogTitle>{t('Warning', { ns: 'common' })}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t('Do you want to delete')}{' '}
                    <b>
                        {props.firstname} - {props.lastname}
                    </b>
                    ?
                </DialogContentText>
                <TextField
                    size="small"
                    type="text"
                    label={
                        <>
                            Please enter{' '}
                            <i>
                                <b>delete</b>
                            </i>
                        </>
                    }
                    placeholder="delete"
                    onChange={(e) => props.onChangeDeleteField(e)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    disabled={
                        !props.isLoaded || !(props.delete_field === 'delete')
                    }
                    onClick={() =>
                        props.handleDeleteUser(props.selected_user_id)
                    }
                >
                    {props.isLoaded ? (
                        t('Yes', { ns: 'common' })
                    ) : (
                        <CircularProgress size={24} />
                    )}
                </Button>
                <Button
                    color="secondary"
                    variant="outlined"
                    onClick={props.setModalHideDDelete}
                >
                    {t('No', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default UserDeleteWarning;
