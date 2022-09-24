import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import './../../../assets/scss/style.scss';
import Aux from '../../../hoc/_Aux';
import Breadcrumb from '../../../App/layout/AdminLayout/Breadcrumb';
import { register } from '../../../api';
import taiger_logo from '../../../assets/images/taiger_logo.png';

export default function SignUp1({ userData }) {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordconfirm, setPasswordConfirm] = useState();
  const [firstname, setFirstame] = useState();
  const [lastname, setLastname] = useState();
  const [signupsuccess, setSignupsuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstname) return alert('First name, please!');
    if (!lastname) return alert('Last name, please!');
    if (!email) return alert('Email, please!');
    if (!password || !passwordconfirm) return alert('Please enter passwords');
    if (password !== passwordconfirm) return alert('Password not matched!');

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
      } else {
        alert(resp.data.message);
      }
    } catch (err) {
      // TODO: handle error
      // console.log(err);
    }
  };

  // render() {
  if (signupsuccess) {
    return (
      <Aux>
        <Breadcrumb />
        <div className="auth-wrapper">
          <div className="auth-content">
            <form onSubmit={handleSubmit}>
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
                  <button className="btn btn-success shadow-2 mb-3">
                    Login{' '}
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
        <Breadcrumb />
        <div className="auth-wrapper">
          <div className="auth-content">
            <form onSubmit={handleSubmit}>
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
                {/* <div className="form-group text-left">
                                <div className="checkbox checkbox-fill d-inline">
                                    <input type="checkbox" name="checkbox-fill-2" id="checkbox-fill-2" />
                                    <label htmlFor="checkbox-fill-2" className="cr">Send me the <a href={DEMO.BLANK_LINK}> Newsletter</a> weekly.</label>
                                </div>
                            </div> */}
                <button className="btn btn-success shadow-2 mb-3">
                  Sign up
                </button>
                <p className="mb-0 text-light">Allready have an account?</p>
                <NavLink to="/auth/login">
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
