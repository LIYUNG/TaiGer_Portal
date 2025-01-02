import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import i18next from 'i18next';

function UserArchivWarning(props) {
    return (
        <Dialog
            open={props.archivUserWarning}
            onClose={props.setModalArchivHide}
            aria-labelledby="contained-modal-title-vcenter"
        >
            <DialogTitle>{i18next.t('Warning', { ns: 'common' })}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {' '}
                    Do you want to archiv{' '}
                    <b>
                        {props.firstname} - {props.lastname}
                    </b>
                    ?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() =>
                        props.updateUserArchivStatus(
                            props.selected_user_id,
                            props.archiv === true ? false : true
                        )
                    }
                >
                    {props.isLoaded
                        ? i18next.t('Yes', { ns: 'common' })
                        : i18next.t('Loading')}
                </Button>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={props.setModalArchivHide}
                >
                    {i18next.t('No', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
export default UserArchivWarning;
