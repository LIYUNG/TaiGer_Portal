import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './../../../assets/scss/style.scss';
import { Spinner } from 'react-bootstrap';
import Aux from '../../../hoc/_Aux';
import { register } from '../../../api';
import taiger_logo from '../../../assets/images/taiger_logo.png';

export default function SignUp1({ userData }) {
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
      // console.log(err);
    }
  };

  const onButtonClick = async (e, buttondisable) => {
    e.preventDefault();
    setButtondisable(buttondisable);
    handleSubmit(e);
  };
  // render() {
  if (signupsuccess) {
    return (
      <Aux>
        <div className="auth-wrapper">
          <div className="auth-content">
            <form>
              <div className="card-body text-center">
                <img
                  className="mb-3 img-radius"
                  src={taiger_logo}
                  alt="Generic placeholder"
                />
                <h3 className="mb-3 text-info">Confirmation Email sent</h3>
                <div className="input-group mb-3">
                  <p className="mb-3 text-muted">
                    Please go to your email and activate your registration.
                  </p>
                </div>
                <NavLink to="/">
                  <button
                    className="btn btn-success shadow-2 mb-3"
                    disabled={buttondisable}
                  >
                    {buttondisable ? (
                      <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden"></span>
                      </Spinner>
                    ) : (
                      'Login'
                    )}
                  </button>
                </NavLink>
              </div>
            </form>
          </div>
        </div>
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
                  className="mb-2 img-radius"
                  src={taiger_logo}
                  alt="Generic placeholder"
                />
                <h3 className="mb-3 text-info">Sign up</h3>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    onChange={(e) => setFirstame(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password confirmation"
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                  />
                </div>
                <button
                  className="btn btn-success shadow-2 mb-3"
                  disabled={buttondisable}
                  onClick={(e) => onButtonClick(e, true)}
                >
                  {buttondisable ? (
                    <Spinner animation="border" role="status" size="sm">
                      <span className="visually-hidden"></span>
                    </Spinner>
                  ) : (
                    'Sign up'
                  )}
                </button>
                <p className="mb-0 text-light">Already have an account?</p>
                <NavLink to="/login">
                  <p className="mb-0 text-muted">Login</p>Login
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </Aux>
    );
  }
}

SignUp1.propTypes = {
  setToken: PropTypes.func.isRequired
};
