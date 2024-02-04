import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { register } from '../../../api';
import AuthWrapper from '../../../components/AuthWrapper';
import { Button, Typography } from '@mui/material';

export default function SignUp1({ userData }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordconfirm, setPasswordConfirm] = useState();
  const [firstname, setFirstame] = useState();
  const [lastname, setLastname] = useState();
  const [signupsuccess, setSignupsuccess] = useState(false);
  const [buttondisable, setButtondisable] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstname) {
      alert('First name, please!');
      setButtondisable(false);
      return;
    }
    if (!lastname) {
      alert('Last name, please!');
      setButtondisable(false);
      return;
    }
    if (!email) {
      alert('Email, please!');
      setButtondisable(false);
      return;
    }
    if (!password || !passwordconfirm) {
      alert('Please enter passwords');
      setButtondisable(false);
      return;
    }
    if (password !== passwordconfirm) {
      alert('Password not matched!');
      setButtondisable(false);
      return;
    }

    try {
      const resp = await register({
        firstname,
        lastname,
        email,
        password
      });
      // userData(resp);
      const { success } = resp.data;
      if (success) {
        setSignupsuccess(true);
        setButtondisable(false);
      } else {
        alert(resp.data.message);
        setButtondisable(false);
      }
    } catch (err) {
      // TODO: handle error
    }
  };

  const onButtonClick = async (e, buttondisable) => {
    e.preventDefault();
    setButtondisable(buttondisable);
    handleSubmit(e);
  };

  if (signupsuccess) {
    return (
      <AuthWrapper>
        <Typography variant="h5">{t('Confirmation Email sent')}</Typography>
        <Typography variant="h6">
          {t('Please go to your email and activate your registration.')}
        </Typography>
        <NavLink to="/account/login">
          <Button color="success" disabled={buttondisable}>
            {buttondisable ? <CircularProgress /> : t('Login')}
          </Button>
        </NavLink>
      </AuthWrapper>
    );
  } else {
    return (
      <AuthWrapper>
        <Typography variant="h5">{t('Sign up')}</Typography>
        <input
          type="text"
          className="form-control"
          placeholder="First name"
          onChange={(e) => setFirstame(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Last name"
          onChange={(e) => setLastname(e.target.value)}
        />
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="form-control"
          placeholder="Password confirmation"
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Button
          color="success"
          disabled={buttondisable}
          onClick={(e) => onButtonClick(e, true)}
        >
          {buttondisable ? <CircularProgress /> : t('Sign up')}
        </Button>
        <Typography>{t('Already have an account?')}</Typography>
        <NavLink to="/login">
          <Typography>{t('Login')}</Typography>
        </NavLink>
      </AuthWrapper>
    );
  }
}
