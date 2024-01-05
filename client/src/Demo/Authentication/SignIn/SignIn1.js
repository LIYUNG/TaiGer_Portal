import React, { useState, useEffect, useRef } from 'react';
import { Spinner, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Aux from '../../../hoc/_Aux';
import { login } from '../../../api/index';
import Reactivation from '../Activation/Reactivation';
import { appConfig } from '../../../config';
// import LoginPageLogo from appConfig.LoginPageLogo;
import Footer from '../../../components/Footer/Footer';

export default function Signin1({ setUserdata }) {
  const [emailaddress, setEmailaddress] = useState();
  const [password, setPassword] = useState();
  const [loginsuccess, setLoginsuccess] = useState(true);
  const [buttondisable, setButtondisable] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [reactivateAccount, setReactivateAccount] = useState(false);
  const { t, i18n } = useTranslation();
  const clickRef = useRef();
  useEffect(() => {
    setIsLoaded(true);
  }, [emailaddress, password, buttondisable]);

  const emailValidation = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailaddress || regex.test(emailaddress) === false) {
      return false;
    }
    return true;
  };
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
          setUserdata((state) => ({
            ...state,
            success: resp.data.success,
            data: resp.data.data,
            isloaded: true
          }));
        }
      } else {
        alert('Email or password not correct.');
        setLoginsuccess(false);
        setButtondisable(false);
      }
    } catch (e) {
      // TODO: Error handler
      // console.log(e);
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

    if (emailValidation()) {
      if (!password) {
        alert('Password please!');
        setButtondisable(false);
      } else {
        try {
          const resp = await login({ email: emailaddress, password });
          setuserdata2(resp);
          setButtondisable(false);
        } catch (err) {
          // TODO: handle error
          alert('Server is busy! Please try in 5 minutes later.');
          setButtondisable(false);
          // setButtondisable(false);
          // console.log(err);
        }
      }
    } else {
      alert('Email is not valid');
      setButtondisable(false);
    }
  };

  const onButtonClick = async (e, buttondisable) => {
    e.preventDefault();
    setButtondisable(buttondisable);
    setLoginsuccess(true);
    handleSubmit(e);
  };

  if (reactivateAccount) {
    return (
      <Aux>
        <Reactivation email={emailaddress} />
      </Aux>
    );
  } else {
    return (
      <Aux>
        <div className="auth-wrapper">
          <div className="auth-content">
            <form>
              <div className="card-body text-center">
                <img
                  className="img-radius"
                  src={appConfig.LoginPageLogo}
                  alt="Generic placeholder"
                />
                <p className="mb-4"></p>
                <div className="input-group mb-3">
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    // value={emailaddress}
                    placeholder="Email"
                    onChange={(e) => onChangeEmail(e, e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    id="password"
                    type="password"
                    className="form-control"
                    // value={password}
                    placeholder="password"
                    onChange={(e) => onChangePassword(e, e.target.value)}
                  />
                </div>
                {!loginsuccess && (
                  <p className="mb-2 text-danger">
                    Email or password is not correct.
                  </p>
                )}
                <Button
                  // ref={clickRef}
                  // disabled={!emailaddress || !password || buttondisable}
                  onClick={(e) => onButtonClick(e, true)}
                  // autoFocus
                  type="submit"
                  variant="primary"
                  // className="btn btn-success mb-2"
                >
                  {buttondisable ? (
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  ) : (
                    `${t('Login')}`
                  )}
                </Button>
                <p className="mb-2 text-light">{t('Forgot Password')}?</p>
                <NavLink to="/forgot-password">
                  <p className="text-info">{t('Reset Login Password')}</p>
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
