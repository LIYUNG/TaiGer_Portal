import React from 'react';
import { CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <div
      // maxWidth="md"
      style={{
        position: 'fixed',
        transform: 'translate(-50%, -50%)',
        top: '40%',
        left: '50%'
      }}
    >
      <CircularProgress />
    </div>
  );
}
