import React, { useState } from 'react';
import { Link as LinkDom } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Breadcrumbs,
  Link,
  Typography
} from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { useTranslation } from 'react-i18next';

function CreateComplaintTicket({ addTicket }) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (description.trim()) {
      addTicket({ description, status: 'Open', id: Date.now() });
      setDescription('');
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.DASHBOARD_LINK}`}
        >
          {appConfig.companyName}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={LinkDom}
          to={`${DEMO.CUSTOMER_CENTER_LINK}`}
        >
          {t('Customer Center', { ns: 'common' })}
        </Link>
        <Typography color="text.primary">Add Ticket</Typography>
      </Breadcrumbs>
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
