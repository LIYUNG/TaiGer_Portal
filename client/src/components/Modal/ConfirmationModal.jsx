import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';

export const ConfirmationModal = ({
    onClose,
    onConfirm,
    title,
    open,
    content,
    confirmText,
    closeText,
    isLoading
}) => {
    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{content}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={isLoading}
                    onClick={onConfirm}
                    startIcon={isLoading && <CircularProgress size={20} />}
                    variant="contained"
                >
                    {confirmText}
                </Button>
                <Button onClick={onClose} variant="outlined">
                    {closeText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
