import React, { Fragment, useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Example icon from Material UI
import { getCheckDocumentPatternIsPassed } from '../../../api';
import { Stack } from '@mui/system';
import { useTranslation } from 'react-i18next';

const DocumentCheckingResultModal = ({
  open,
  onClose,
  onConfirm,
  title,
  isFinalVersion,
  file_type,
  thread_id,
  student_name,
  docName
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [acknowledge, setAcknowledge] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (open && file_type === 'CV' && !isFinalVersion) {
      fetchData();
    } else {
      // Reset state when the dialog closes
      setCanProceed(false);
      setError('');
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      const { data, status } = await getCheckDocumentPatternIsPassed(
        thread_id,
        file_type
      );
      const { isPassed, success, reason } = data;
      if (!success) {
        throw new Error(`Error: ${status}`); // Handle HTTP errors
      }
      if (!isPassed) {
        setCanProceed(false);
        setReason(reason);
        return;
      }
      setCanProceed(true);
      setAcknowledge(true);
    } catch (err) {
      setCanProceed(false);
      setError(err.message); // Handle errors
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="proceed-dialog-title"
      aria-describedby="proceed-dialog-description"
    >
      <DialogTitle>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
        >
          <ErrorOutlineIcon sx={{ fontSize: 32, color: 'error.main' }} />
          {title}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {!isFinalVersion && file_type === 'CV' ? (
            loading ? (
              <CircularProgress />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Fragment>
                {canProceed ? (
                  <Fragment>
                    <Typography id="proceed-dialog-description">
                      The latest {`${student_name} ${docName} `}
                      looks like safe to close.
                    </Typography>
                    <Typography id="proceed-dialog-description">
                      {t('proceed-close')}
                    </Typography>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Typography variant="h6">{t('gap-detected')}</Typography>
                    <Typography variant="body1" sx={{ my: 2 }}>
                      The latest {`${student_name} ${docName} `}
                      did not contain pattern and very likely has <b>gap</b>:
                      Please consider add the following pattern: {reason} in the
                      document.
                    </Typography>
                    <FormControlLabel
                      label={`I checked ${docName} again and I am sure it contains the patterns above and does not have gap.`}
                      control={
                        <Checkbox
                          checked={acknowledge}
                          onChange={() => setAcknowledge(!acknowledge)}
                        />
                      }
                    />
                  </Fragment>
                )}
              </Fragment>
            )
          ) : isFinalVersion ? (
            <>
              Do you want to set{' '}
              <b>
                {student_name} {docName}
              </b>{' '}
              as <b>open</b>
            </>
          ) : (
            <>
              Do you want to set{' '}
              <b>
                {student_name} {docName}
              </b>{' '}
              as <b>final</b>
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={
            file_type === 'CV' && !isFinalVersion
              ? loading || !acknowledge
              : false
          }
        >
          Yes
        </Button>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentCheckingResultModal;
