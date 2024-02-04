import React, { useEffect, useState } from 'react';
import {
  Grid,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Card,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import ErrorPage from '../Utils/ErrorPage';
import ModalMain from '../Utils/ModalHandler/ModalMain';

import { updateCredentials } from '../../api';
import { TabTitle } from '../Utils/TabTitle';
import { useAuth } from '../../components/AuthProvider';
import ModalNew from '../../components/Modal';
import { useCustomTheme } from '../../components/ThemeProvider';

function Settings() {
  const { isDarkMode, toggleDarkMode } = useCustomTheme();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [settingsState, setSettingsState] = useState({
    error: '',
    role: '',
    isLoaded: false,
    data: null,
    success: false,
    user: {},
    changed_personaldata: false,
    personaldata: {
      firstname: user.firstname,
      firstname_chinese: user.firstname_chinese,
      lastname: user.lastname,
      lastname_chinese: user.lastname_chinese,
      birthday: user.birthday
    },
    credentials: {
      current_password: '',
      new_password: '',
      new_password_again: ''
    },
    updatecredentialconfirmed: false,
    res_status: 0,
    res_modal_message: '',
    res_modal_status: 0
  });

  useEffect(() => {
    setSettingsState({
      ...settingsState,
      isLoaded: true,
      success: true
    });
  }, []);

  const handleChange_Credentials = (e) => {
    var credentials_temp = { ...settingsState.credentials };
    credentials_temp[e.target.id] = e.target.value;
    setSettingsState({
      ...settingsState,
      credentials: credentials_temp
    });
  };

  const handleSubmit_Credentials = (e, credentials, email) => {
    if (credentials.new_password !== credentials.new_password_again) {
      alert('New password not matched');
      return;
    }
    if (credentials.new_password.length < 8) {
      alert('New password should have at least 8 characters.');
      return;
    }
    updateCredentials(credentials, email, credentials.current_password).then(
      (resp) => {
        const { success } = resp.data;
        const { status } = resp;
        if (success) {
          setSettingsState({
            ...settingsState,
            isLoaded: true,
            success: success,
            updatecredentialconfirmed: true,
            res_modal_status: status
          });
        } else {
          const { message } = resp.data;
          setSettingsState({
            isLoaded: true,
            res_modal_message: message,
            res_modal_status: status
          });
        }
      },
      (error) => {
        setSettingsState({
          ...settingsState,
          isLoaded: true,
          error,
          res_modal_status: 500,
          res_modal_message: ''
        });
      }
    );
  };

  const setmodalhideUpdateCredentials = () => {
    logout();
  };

  const ConfirmError = () => {
    setSettingsState({
      ...settingsState,
      res_modal_status: 0,
      res_modal_message: ''
    });
  };

  const { res_status, isLoaded, res_modal_status, res_modal_message } =
    settingsState;
  TabTitle('Settings');
  if (!isLoaded) {
    return <CircularProgress />;
  }

  if (res_status >= 400) {
    return <ErrorPage res_status={res_status} />;
  }

  return (
    <Grid container spacing={2}>
      {res_modal_status >= 400 && (
        <ModalMain
          ConfirmError={ConfirmError}
          res_modal_status={res_modal_status}
          res_modal_message={res_modal_message}
        />
      )}
      <Grid item xs={12}>
        <Typography variant="h5">{t('Settings')}</Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">{t('Reset Login Password')}</Typography>
          <TextField
            fullWidth
            id="current_password"
            margin="normal"
            required
            label={`${t('Current Password')}`}
            autoComplete="off"
            type="password"
            onChange={(e) => handleChange_Credentials(e)}
          />
          <TextField
            fullWidth
            id="new_password"
            margin="normal"
            required
            label={`${t('Enter New Password')}`}
            autoComplete="off"
            type="password"
            onChange={(e) => handleChange_Credentials(e)}
          />
          <TextField
            fullWidth
            id="new_password_again"
            margin="normal"
            required
            label={`${t('Enter New Password Again')}`}
            autoComplete="off"
            type="password"
            onChange={(e) => handleChange_Credentials(e)}
          />
          <Button
            fullWidth
            disabled={
              settingsState.credentials.current_password === '' ||
              settingsState.credentials.new_password === '' ||
              settingsState.credentials.new_password_again === ''
            }
            color="primary"
            variant="contained"
            onClick={(e) =>
              handleSubmit_Credentials(e, settingsState.credentials, user.email)
            }
          >
            {t('Reset Password')}
          </Button>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography>{t('Theme')}</Typography>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={isDarkMode}
              onChange={toggleDarkMode}
            >
              <FormControlLabel value={true} control={<Radio />} label="Dark" />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Light"
              />
            </RadioGroup>
          </FormControl>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography>{t('Notification')}</Typography>
        <Typography>{t('Comming soon')}</Typography>
      </Grid>
      <ModalNew
        open={settingsState.updatecredentialconfirmed}
        onClose={setmodalhideUpdateCredentials}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Typography variant="h6">
          {t('Update Credentials Successfully')}
        </Typography>
        <Typography>
          {t('Credentials are updated successfully! Please login again.')}
        </Typography>
        <br />
        <div style={{ marginTop: 'auto', textAlign: 'right' }}>
          <Button
            color="primary"
            variant="contained"
            onClick={(e) => setmodalhideUpdateCredentials(e)}
          >
            {t('Ok')}
          </Button>
        </div>
      </ModalNew>
    </Grid>
  );
}

export default Settings;
