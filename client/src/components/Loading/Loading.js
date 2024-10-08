import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '40%',
        left: '50%'
      }}
    >
      <CircularProgress />
    </div>
  );
}
