import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Loading() {
  const { t } = useTranslation();
  const [showExtraMessage, setShowExtraMessage] = useState(false);

  useEffect(() => {
    // Set a timeout to show extra message after 3 minutes
    const timer = setTimeout(() => {
      setShowExtraMessage(true);
    }, 0.5 * 1000); // 0.5 second

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        zIndex: -1 // Ensure it stays above other content
      }}
    >
      <CircularProgress />
      <Typography variant="h6" color="white" mt={2}>
        {t('loading', { ns: 'common' })}
      </Typography>
      {showExtraMessage && (
        <Typography variant="body2" color="textSecondary">
          {t('almost-done', { ns: 'common' })}
        </Typography>
      )}
    </Box>
  );
}
