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
                    <Typography>
                        {t('Please login with your new password')}
                    </Typography>
                    <NavLink sx={{ mb: 2 }} to={DEMO.LOGIN_LINK}>
                        <Typography>{t('Login', { ns: 'auth' })}</Typography>
                    </NavLink>
                </>
            ) : (
                <>
                    <Typography variant="h5">
                        {t('Reset Login Password')}
                    </Typography>
                    <Typography>
                        Password must contain at least:
                        <br />- 1 Uppercase
                        <br />- 1 Lowercase
                        <br />- 1 number
                        <br />- 1 special character
                        <br />- length of 8 - 20 characters
                    </Typography>
                    <TextField
                        autoComplete="password"
                        fullWidth
                        id="password-input"
                        label={t('Enter New Password')}
                        margin="normal"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        type="password"
                    />
                    <TextField
                        autoComplete="password"
                        fullWidth
                        id="password-again-input"
                        label={t('Enter New Password Again')}
                        margin="normal"
                        onChange={(e) => setPasswordRepeat(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                        type="password"
                    />
                    <Button
                        color="primary"
                        disabled={buttonDisable}
                        onClick={handleSubmit}
                        sx={{ mb: 2 }}
                        variant="contained"
                    >
                        {buttonDisable ? (
                            <CircularProgress />
                        ) : (
                            `${t('Reset', { ns: 'common' })}`
                        )}
                    </Button>
                    <Grid container spacing={2} sx={{ my: 2 }}>
                        <Grid item sx={{ textAlign: 'right' }} xs={6}>
                            <Typography sx={{ mb: 2 }}>
                                {t('Already have an account')}?{' '}
                            </Typography>{' '}
                        </Grid>
                        <Grid item xs={6}>
                            <Link
                                component={NavLink}
                                sx={{ mb: 2 }}
                                to={DEMO.LOGIN_LINK}
                            >
                                <Typography>
                                    {t('Login', { ns: 'auth' })}
                                </Typography>
                            </Link>
                        </Grid>
                    </Grid>
                </>
            )}
        </AuthWrapper>
    );
}
