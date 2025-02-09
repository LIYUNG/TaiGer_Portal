import React, { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { activation, resendActivation } from '../../../api/index';
import AuthWrapper from '../../../components/AuthWrapper';

export default function Activation() {
    const { t } = useTranslation();
    const query = new URLSearchParams(window.location.search);
    const email = query.get('email');
    const token = query.get('token');
    const [activationsuccess, setActivationSuccess] = React.useState(false);
    const [emailsent, setEmailsent] = React.useState(false);

    useEffect(() => {
        activation(email, token).then((res) => {
            const { success } = res.data;
            if (success) {
                setActivationSuccess(true);
            } else {
                setActivationSuccess(false);
            }
        });
    }, [email, token]);

    //TODO: default call API to get token
    const handleResendSubmit = async (e) => {
        e.preventDefault();
        setEmailsent(true);
        try {
            const resp = await resendActivation({
                email: email
            });
            const { success } = resp.data;
            if (success) {
                setEmailsent(true);
            } else {
                alert(resp.data.message);
            }
        } catch (err) {
            // TODO: handle error
        }
    };

    const handleonClick = async () => {
        window.location.reload(false);
    };
    // if return 200, then show Start button, otherwise, resend the activation email with token.
    return (
        <AuthWrapper>
            {activationsuccess ? (
                <>
                    <Typography>{t('Account activated')}</Typography>
                    <Typography>
                        {t('You have activated the account successfully!')}
                    </Typography>
                    <Button color="primary" onClick={() => handleonClick()}>
                        {t('Start')}
                    </Button>
                </>
            ) : null}
            {!activationsuccess && emailsent ? (
                <>
                    <Typography>{t('Confirmation Email sent')}</Typography>
                    <Typography>
                        {t(
                            'The new activation link is sent to the following address'
                        )}
                        :
                    </Typography>
                    <Typography>{email}</Typography>
                </>
            ) : null}
            {!activationsuccess && !emailsent ? (
                <>
                    <Typography>{t('Link Expired')}</Typography>
                    <Typography>
                        {t(
                            'The activation link is expired. Please request another activation link!'
                        )}
                    </Typography>
                    <Button
                        color="primary"
                        onClick={(e) => handleResendSubmit(e)}
                        variant="contained"
                    >
                        {t('Resend')}
                    </Button>
                </>
            ) : null}
        </AuthWrapper>
    );
}
