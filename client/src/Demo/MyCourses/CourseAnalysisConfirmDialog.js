import React from 'react';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';

import { useTranslation } from 'react-i18next';

const CourseAnalysisConfirmDialog = ({
    show,
    data,
    isButtonDisable,
    setModalHide,
    onAnalyse
}) => {
    const { t } = useTranslation();

    return (
        <Dialog
            aria-labelledby="contained-modal-title-vcenter"
            onClose={setModalHide}
            open={show}
        >
            <DialogTitle>
                Analyse{' '}
                {data.map((requirement, i) => (
                    <Typography key={i}>{requirement.program_name}</Typography>
                ))}
            </DialogTitle>
            <DialogContent>
                <TableContainer style={{ overflowX: 'auto' }}>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell> </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    disabled={isButtonDisable}
                    onClick={(e) => onAnalyse(e)}
                    variant="contained"
                >
                    {isButtonDisable ? (
                        <CircularProgress size={24} />
                    ) : (
                        t('Analyze', { ns: 'common' })
                    )}
                </Button>
                <Button
                    color="secondary"
                    onClick={setModalHide}
                    variant="outlined"
                >
                    {t('Cancel', { ns: 'common' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CourseAnalysisConfirmDialog;
