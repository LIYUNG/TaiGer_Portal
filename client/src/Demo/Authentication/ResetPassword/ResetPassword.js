import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  CircularProgress,
  Grid,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import { resetPassword } from '../../../api/index';
import AuthWrapper from '../../../components/AuthWrapper';
import DEMO from '../../../store/constant';

export default function ResetPassword() {
  const { t } = useTranslation();
  const query = new URLSearchParams(window.location.search);
  const email = query.get('email');
  const token = query.get('token');
  const [passwordchanged, setPasswordchanged] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [buttonDisable, setButtonDisable] = useState(false);
  const passwordValidation = () => {
    if (password === '') return false;
    if (password.length < 8) return false;
    var decimal =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    if (decimal.test(password) === false) return false;
    // const regex =
    //   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // if (!email || regex.test(email) === false) {
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordValidation()) {
      try {
        // check 2 password match
        if (password === passwordRepeat) {
          setButtonDisable(true);
          const resp = await resetPassword({
            email,
            password,
            token
          });
          const { success } = resp.data;
          setButtonDisable(false);
          if (success) {
            setPasswordchanged(true);
          }
        } else {
          setButtonDisable(false);
          alert('Password did not match!');
        }
      } catch (err) {
        setButtonDisable(false);
        // TODO: error handler
      }
    } else {
      setButtonDisable(false);
      alert('Password is not valid');
    }
  };
  return (
    <AuthWrapper>
      {passwordchanged ? (
        <>
          <Typography variant="h6">
            {t('Password change successfully!')}
          </Typography>
          <Typography>{t('Please login with your new password')}</Typography>
          <NavLink to={DEMO.LOGIN_LINK} sx={{ mb: 2 }}>
            <Typography>{t('Login', { ns: 'auth' })}</Typography>
          </NavLink>
        </>
      ) : (
        <>
          <Typography variant="h5">{t('Reset Login Password')}</Typography>
          <Typography>
            Password must contain at least:
            <br />- 1 Uppercase
            <br />- 1 Lowercase
            <br />- 1 number
            <br />- 1 special character
            <br />- length of 8 - 20 characters
          </Typography>
          <TextField
            id="password-input"
            margin="normal"
            required
            fullWidth
            label={t('Enter New Password')}
            type="password"
            autoComplete="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            id="password-again-input"
            margin="normal"
            required
            fullWidth
            label={t('Enter New Password Again')}
            type="password"
            autoComplete="password"
            onChange={(e) => setPasswordRepeat(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            color="primary"
            variant="contained"
            onClick={handleSubmit}
            disabled={buttonDisable}
            sx={{ mb: 2 }}
          >
            {buttonDisable ? <CircularProgress /> : `${t('Reset')}`}
          </Button>
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography sx={{ mb: 2 }}>
                {t('Already have an account')}?{' '}
              </Typography>{' '}
            </Grid>
            <Grid item xs={6}>
              <Link to={DEMO.LOGIN_LINK} sx={{ mb: 2 }} component={NavLink}>
                <Typography>{t('Login', { ns: 'auth' })}</Typography>
              </Link>
            </Grid>
          </Grid>
        </>
      )}
    </AuthWrapper>
  );
}
