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
    // Alert
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
                if (
                    resp.status === 400 ||
                    resp.status === 401 ||
                    resp.status === 500
                ) {
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
                console.error(err);
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
                {/* <Alert variant="filled" severity="warning" sx={{ mt: 1 }}>
          System is recently updated, in case any issue, please email
          taiger.leoc@gmail.com
        </Alert> */}
                <Typography component="h1" sx={{ mt: 1 }} variant="h5">
                    {t('Sign in', { ns: 'auth' })}
                </Typography>
                <form onSubmit={(e) => onLoginSubmit(e, true)}>
                    <TextField
                        autoComplete="email"
                        fullWidth
                        id="email"
                        label={t('Email Address')}
                        margin="normal"
                        onChange={(e) => onChangeEmail(e, e.target.value)}
                        required
                        type="email"
                    />
                    <TextField
                        autoComplete="password"
                        fullWidth
                        id="standard-password-input"
                        label={t('Password', { ns: 'common' })}
                        margin="normal"
                        onChange={(e) => onChangePassword(e, e.target.value)}
                        required
                        type="password"
                    />
                    {!loginsuccess ? (
                        <Typography>
                            Email or password is not correct.
                        </Typography>
                    ) : null}
                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        type="submit"
                        variant="contained"
                    >
                        {buttondisable ? (
                            <CircularProgress
                                color="secondary"
                                size={24}
                                sx={{ color: 'white' }}
                            />
                        ) : (
                            <Typography>{`${t('Login', { ns: 'auth' })}`}</Typography>
                        )}
                    </Button>
                </form>
                <Grid container spacing={2} sx={{ my: 1 }}>
                    <Grid item sx={{ textAlign: 'center' }} xs={12}>
                        <Typography>
                            {t('Forgot Password', { ns: 'common' })}?{' '}
                            <Link
                                component={NavLink}
                                to={DEMO.FORGOT_PASSWORD_LINK}
                            >
                                {t('Reset Login Password')}
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item sx={{ textAlign: 'center' }} xs={12}>
                        <Typography>
                            <Link
                                component={NavLink}
                                to={DEMO.LANDING_PAGE_LINK}
                            >
                                {t('Home')}
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </AuthWrapper>
        );
    }
}
