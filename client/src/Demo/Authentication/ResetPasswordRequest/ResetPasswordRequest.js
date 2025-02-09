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
            <Typography component="h1" sx={{ my: 2 }} variant="h5">
                {t('Reset Login Password')}
            </Typography>
            {emailSent ? (
                <Typography>
                    {t(
                        'Password reset email is already sent to your give email address'
                    )}
                    <br />
                    {t('Please have a check')}
                </Typography>
            ) : (
                <>
                    <Typography component="h1" variant="h6">
                        {t(
                            'Please provide the email that you provided to us before'
                        )}
                    </Typography>
                    <TextField
                        autoComplete="email"
                        fullWidth
                        id="email"
                        label={t('Email Address')}
                        margin="normal"
                        onChange={(e) => setEmailaddress(e.target.value)}
                        required
                        type="email"
                    />
                    <Button
                        color="primary"
                        disabled={buttonDisable}
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                        variant="contained"
                    >
                        {buttonDisable ? (
                            <CircularProgress />
                        ) : (
                            `${t('Reset', { ns: 'common' })}`
                        )}
                    </Button>
                </>
            )}
            <Grid container spacing={2} sx={{ my: 2 }}>
                <Grid item sx={{ textAlign: 'right' }} xs={6}>
                    <Typography>{t('Already have an account')}?</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Link component={NavLink} to={DEMO.LOGIN_LINK}>
                        <Typography>{t('Login', { ns: 'auth' })}</Typography>
                    </Link>
                </Grid>
            </Grid>
        </AuthWrapper>
    );
}
