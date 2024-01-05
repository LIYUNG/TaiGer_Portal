import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import './../../../assets/scss/style.scss';
import Aux from '../../../hoc/_Aux';
import { forgotPassword } from '../../../api';
import Footer from '../../../components/Footer/Footer';
import { appConfig } from '../../../config';

export default function ResetPasswordRequest() {
  const { t, i18n } = useTranslation();
  const [emailaddress, setEmailaddress] = useState();
  const [emailSent, setEmailSent] = useState(false);
  const [buttonDisable, setButtonDisable] = useState(false);
  const emailValidation = () => {
    const regex =
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
        // console.log(err);
      }
    } else {
      alert('Email is not valid');
    }
  };
  if (emailSent) {
    return (
      <Aux>
        <div className="auth-wrapper">
          <div className="auth-content">
            <div>
              <div className="card-body text-center">
                <img
                  className="mb-3 img-radius"
                  src={appConfig.LoginPageLogo}
                  alt="Generic placeholder"
                />
                <h3 className="mb-3 text-light">{t('Reset Login Password')}</h3>
                <p className="mb-3 text-light">
                  {t(
                    'Password reset email is already sent to your give email address'
                  )}
                  <br />
                  {t('Please have a check')}
                </p>
                <p className="mb-2 text-light">
                  {t('Already have an account')}?{' '}
                  <NavLink to="/login">
                    <p className="text-info">Login</p>
                  </NavLink>
                </p>
                <Footer />
              </div>
            </div>
          </div>
        </div>
      </Aux>
    );
  } else {
    return (
      <Aux>
        <div className="auth-wrapper">
          <div className="auth-content">
            <form onSubmit={handleSubmit}>
              <div className="card-body text-center">
                <img
                  className="mb-3 img-radius"
                  src={appConfig.LoginPageLogo}
                  alt="Generic placeholder"
                />
                <p className="mb-4"></p>
                <h3 className="mb-4 text-light">{t('Reset Login Password')}</h3>
                <p className="mb-4 text-light">
                  {t('Please provide the email that you provided to us before')}
                </p>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => setEmailaddress(e.target.value)}
                  />
                </div>
                <button
                  size="sm"
                  type="submit"
                  disabled={buttonDisable}
                  className="btn btn-success text-secondary shadow-2 mb-2"
                >
                  {buttonDisable ? (
                    <Spinner
                      animation="border"
                      role="status"
                      variant="light"
                      size="sm"
                    >
                      <span className="visually-hidden"></span>
                    </Spinner>
                  ) : (
                    `${t('Reset')}`
                  )}
                </button>
                <p className="mb-2 text-light"></p>
                {t('Already have an account')}?{' '}
                <NavLink to="/login">
                  <p className="text-info">{t('Login')}</p>
                </NavLink>
                <Footer />
              </div>
            </form>
          </div>
        </div>
      </Aux>
    );
  }
}
