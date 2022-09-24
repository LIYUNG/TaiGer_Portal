import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './../../../assets/scss/style.scss';
import Aux from '../../../hoc/_Aux';
import Breadcrumb from '../../../App/layout/AdminLayout/Breadcrumb';
import DEMO from '../../../store/constant';
import { forgotPassword } from '../../../api';
import taiger_logo from '../../../assets/images/taiger_logo.png';

export default function ResetPasswordRequest() {
  const [emailaddress, setEmailaddress] = useState();
  const [emailSent, setEmailSent] = useState(false);
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
        const resp = await forgotPassword({ email: emailaddress });
        if (resp.data.success) {
          setEmailSent(true);
        } else {
          alert('Email is not existed!');
        }
      } catch (err) {
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
        <Breadcrumb />
        <div className="auth-wrapper">
          <div className="auth-content">
            <div className="card">
              <div className="card-body text-center">
                <img
                  className="mb-3 img-radius"
                  src={taiger_logo}
                  alt="Generic placeholder"
                />
                <h3 className="mb-3">Reset Password</h3>
                <div className="input-group mb-3">
                  <p>
                    Password reset email is already sent to your give email
                    address. Please have a check.
                  </p>
                </div>
                <p className="mb-2">
                  Allready have an account?{' '}
                  <NavLink to="/auth/login">
                    <p className="text-muted">Login</p>
                  </NavLink>
                </p>
              </div>
            </div>
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
                {/* <div className="mb-4">
                  <i className="feather icon-user-plus auth-icon" />
                </div> */}
                <img
                  className="mb-3 img-radius"
                  src={taiger_logo}
                  alt="Generic placeholder"
                />
                <p className="mb-4"></p>
                <h3 className="mb-4 text-info">Reset Password</h3>
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
                  className="btn btn-success text-secondary shadow-2 mb-2"
                >
                  Reset
                </button>
                <p className="mb-2">
                  Allready have an account?{' '}
                  <NavLink to="/auth/login">
                    <p className="text-muted">Login</p>
                  </NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </Aux>
    );
  }
}
