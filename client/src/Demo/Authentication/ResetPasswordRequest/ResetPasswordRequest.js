import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Link,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { forgotPassword } from '../../../api';
import AuthWrapper from '../../../components/AuthWrapper';
import DEMO from '../../../store/constant';

export default function ResetPasswordRequest() {
  const { t } = useTranslation();
  const [emailaddress, setEmailaddress] = useState();
  const [emailSent, setEmailSent] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const emailValidation = () => {
    const regex =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailaddress || regex.test(emailaddress) === false) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailValidation()) {
      try {
        setButtonDisable(true);
        const resp = await forgotPassword({ email: emailaddress });
        if (resp.data.success) {
          setButtonDisable(false);
          setEmailSent(true);
        } else {
          setButtonDisable(false);
          alert('Email is not existed!');
        }
      } catch (err) {
        setButtonDisable(false);
        // TODO: error handler
      }
    } else {
      alert('Email is not valid');
    }
  };
  return (
    <AuthWrapper>
      <Typography component="h1" variant="h5" sx={{ my: 2 }}>
        {t('Reset Login Password')}
      </Typography>
      {emailSent ? (
        <>
          <Typography>
            {t(
              'Password reset email is already sent to your give email address'
            )}
            <br />
            {t('Please have a check')}
          </Typography>
        </>
      ) : (
        <>
          <Typography component="h1" variant="h6">
            {t('Please provide the email that you provided to us before')}
          </Typography>
          <TextField
            id="email"
            margin="normal"
            required
            fullWidth
            label={t('Email Address')}
            type="email"
            autoComplete="email"
            onChange={(e) => setEmailaddress(e.target.value)}
          />
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={buttonDisable}
            sx={{ mt: 2 }}
          >
            {buttonDisable ? <CircularProgress /> : `${t('Reset')}`}
          </Button>
        </>
      )}
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Grid item xs={6} sx={{ textAlign: 'right' }}>
          <Typography>{t('Already have an account')}?</Typography>
        </Grid>
        <Grid item xs={6}>
          <Link to={DEMO.LOGIN_LINK} component={NavLink}>
            <Typography>{t('Login', { ns: 'auth' })}</Typography>
          </Link>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
