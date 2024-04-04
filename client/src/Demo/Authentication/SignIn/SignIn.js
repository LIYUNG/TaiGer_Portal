import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  Button,
  Link,
  Box,
  Typography,
  Grid,
  TextField
} from '@mui/material';

import { login as Login } from '../../../api/index';
import Reactivation from '../Activation/Reactivation';
import { useAuth } from '../../../components/AuthProvider';
import AuthWrapper from '../../../components/AuthWrapper';
import DEMO from '../../../store/constant';

export default function SignIn() {
  const { login } = useAuth();
  const [emailaddress, setEmailaddress] = useState();
  const [password, setPassword] = useState();
  const [loginsuccess, setLoginsuccess] = useState(true);
  const [buttondisable, setButtondisable] = useState(false);
  const [reactivateAccount, setReactivateAccount] = useState(false);
  const { t } = useTranslation();

  const setuserdata2 = (resp) => {
    try {
      if (resp) {
        // TODO: what if status is other!!?
        if (resp.status === 400) {
          setLoginsuccess(false);
          setButtondisable(false);
        } else if (resp.status === 401 || resp.status === 500) {
          setLoginsuccess(false);
          setButtondisable(false);
        } else if (resp.status === 403) {
          setReactivateAccount(true);
          setButtondisable(false);
        } else if (resp.status === 429) {
          setLoginsuccess(false);
          alert(`${resp.data}`);
          setButtondisable(false);
        } else {
          setButtondisable(false);
          login(resp.data.data);
          // if (query.get('p')) {
          //   navigate(query.get('p'));
          // } else {
          //   navigate(`${DEMO.DASHBOARD_LINK}`);
          // }
        }
      } else {
        alert('Email or password not correct.');
        setLoginsuccess(false);
        setButtondisable(false);
      }
    } catch (e) {
      // TODO: Error handler
      setButtondisable(false);
    }
  };

  const onChangeEmail = async (e, value) => {
    e.preventDefault();
    setEmailaddress(value);
  };

  const onChangePassword = async (e, value) => {
    e.preventDefault();
    setPassword(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      alert('Password please!');
      setButtondisable(false);
    } else {
      try {
        const resp = await Login({ email: emailaddress, password });
        setuserdata2(resp);
        setButtondisable(false);
      } catch (err) {
        // TODO: handle error
        alert('Server is busy! Please try in 5 minutes later.');
        setButtondisable(false);
      }
    }
  };

  const onLoginSubmit = async (e, buttondisable) => {
    e.preventDefault();
    setButtondisable(buttondisable);
    setLoginsuccess(true);
    handleSubmit(e);
  };

  if (reactivateAccount) {
    return (
      <Box>
        <Reactivation email={emailaddress} />
      </Box>
    );
  } else {
    return (
      <AuthWrapper>
        <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
          {t('Sign in', { ns: 'auth' })}
        </Typography>
        <form onSubmit={(e) => onLoginSubmit(e, true)}>
          <TextField
            id="email"
            margin="normal"
            required
            fullWidth
            label={t('Email Address')}
            type="email"
            autoComplete="email"
            onChange={(e) => onChangeEmail(e, e.target.value)}
          />
          <TextField
            id="standard-password-input"
            margin="normal"
            required
            fullWidth
            label={t('Password', { ns: 'common' })}
            type="password"
            autoComplete="password"
            onChange={(e) => onChangePassword(e, e.target.value)}
          />
          {!loginsuccess && (
            <Typography>Email or password is not correct.</Typography>
          )}
          <Button sx={{ mt: 2 }} fullWidth type="submit" variant="contained">
            {buttondisable ? (
              <CircularProgress
                size={24}
                sx={{ color: 'white' }}
                color="secondary"
              />
            ) : (
              <Typography>{`${t('Login', { ns: 'auth' })}`}</Typography>
            )}
          </Button>
        </form>
        <Grid container spacing={2} sx={{ my: 1 }}>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography>{t('Forgot Password')}?</Typography>
          </Grid>
          <Grid item xs={6}>
            <Link to={DEMO.FORGOT_PASSWORD_LINK} component={NavLink}>
              <Typography>{t('Reset Login Password')}</Typography>
            </Link>
          </Grid>
        </Grid>
      </AuthWrapper>
    );
  }
}
