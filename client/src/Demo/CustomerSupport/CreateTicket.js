import React, { useState } from 'react';
import { Link as LinkDom, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Breadcrumbs,
  Link,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { appConfig } from '../../config';
import DEMO from '../../store/constant';
import { useTranslation } from 'react-i18next';
import { createComplaintTicket } from '../../api';
import { useAuth } from '../../components/AuthProvider';

function CreateComplaintTicket() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async () => {
    const response = await createComplaintTicket({
      requester_id: user?._id.toString(),
      title,
      description,
      category,
      status: 'open'
    });

    // TODO: error handling
    if (response.status === 201) {
      setDescription('');
      setTitle('');
      navigate(DEMO.CUSTOMER_CENTER_LINK);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    setCategory(value);
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
        <Typography color="text.primary">
          {t('Add Ticket', { ns: 'customerCenter' })}
        </Typography>
      </Breadcrumbs>
      <TextField
        label="Describe your title"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel id="select_category">
          {t('Select Category', { ns: 'courses' })}
        </InputLabel>
        <Select
          labelId="select_category"
          label={t('Select Category', { ns: 'courses' })}
          name="select_category"
          id="select_category"
          value={category}
          onChange={(e) => handleChange(e)}
        >
          <MenuItem value={''}>{t('Select Category')}</MenuItem>
          <MenuItem value={'agent'}>
            {t('Report My Agent', { ns: 'common' })}
          </MenuItem>
          <MenuItem value={'editor'}>
            {t('Report My Editor', { ns: 'common' })}
          </MenuItem>
          <MenuItem value={'essay_writer'}>
            {t('Report My Essay Writer', { ns: 'common' })}
          </MenuItem>
          <MenuItem value={'account'}>
            Problem with My {appConfig.companyName} Account
          </MenuItem>
          <MenuItem value={'others'}>{t('Others', { ns: 'common' })}</MenuItem>
        </Select>
      </FormControl>
      {category === 'account' && <>Common Q&A</>}
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
