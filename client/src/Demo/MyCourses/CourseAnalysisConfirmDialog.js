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

function CourseAnalysisConfirmDialog(props) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={props.show}
      onClose={props.setModalHide}
      aria-labelledby="contained-modal-title-vcenter"
    >
      <DialogTitle>
        Analyse{' '}
        {[].map((program_name, i) => (
          <Typography key={i}>
            <b>{program_name}</b>
          </Typography>
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
          variant="contained"
          disabled={props.isButtonDisable}
          onClick={(e) => props.onAnalyseV2(e)}
        >
          {props.isButtonDisable ? (
            <CircularProgress />
          ) : (
            t('Assign', { ns: 'common' })
          )}
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={props.setModalHide}
        >
          {t('Cancel', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CourseAnalysisConfirmDialog;
