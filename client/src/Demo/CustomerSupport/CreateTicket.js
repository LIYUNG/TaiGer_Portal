import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function CreateComplaintTicket({ addTicket }) {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (description.trim()) {
      addTicket({ description, status: 'Open', id: Date.now() });
      setDescription('');
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        label="Describe your situation"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        sx={{ mt: 2 }}
      >
        Submit
      </Button>
    </Box>
  );
}

export default CreateComplaintTicket;
