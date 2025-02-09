import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { register } from '../../../api';
import AuthWrapper from '../../../components/AuthWrapper';
import { Button, CircularProgress, Typography } from '@mui/material';

export default function SignUp1() {
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
                <Typography variant="h5">
                    {t('Confirmation Email sent')}
                </Typography>
                <Typography variant="h6">
                    {t(
                        'Please go to your email and activate your registration.'
                    )}
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
                    className="form-control"
                    onChange={(e) => setFirstame(e.target.value)}
                    placeholder="First name"
                    type="text"
                />
                <input
                    className="form-control"
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Last name"
                    type="text"
                />
                <input
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                />
                <input
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                />
                <input
                    className="form-control"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Password confirmation"
                    type="password"
                />
                <Button
                    color="success"
                    disabled={buttondisable}
                    onClick={(e) => onButtonClick(e, true)}
                >
                    {buttondisable ? (
                        <CircularProgress />
                    ) : (
                        t('Sign up', { ns: 'auth' })
                    )}
                </Button>
                <Typography>{t('Already have an account?')}</Typography>
                <NavLink to="/login">
                    <Typography>{t('Login', { ns: 'auth' })}</Typography>
                </NavLink>
            </AuthWrapper>
        );
    }
}
