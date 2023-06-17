import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import './../../../assets/scss/style.scss';
import Aux from '../../../hoc/_Aux';
import Breadcrumb from '../../../App/layout/AdminLayout/Breadcrumb';
import DEMO from '../../../store/constant';
import { forgotPassword } from '../../../api';
import taiger_logo from '../../../assets/images/taiger_logo.png';
import Footer from '../../../components/Footer/Footer';

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
            <div>
              <div className="card-body text-center">
                <img
                  className="mb-3 img-radius"
                  src={taiger_logo}
                  alt="Generic placeholder"
                />
                <h3 className="mb-3 text-light">Reset Password</h3>
                <div className="input-group mb-3">
                  <p className="mb-3 text-light">
                    Password reset email is already sent to your give email
                    address. Please have a check.
                  </p>
                </div>
                <p className="mb-2 text-light">
                  Already have an account?{' '}
                  <NavLink to="/login">
                    <p className="text-muted">Login</p>
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
                <p className="mb-4"></p>
                <h3 className="mb-4 text-light">Reset Password</h3>
                <p className="mb-4 text-light">
                  Please provide the email that you provided to us before.
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
                  className="btn btn-success text-secondary shadow-2 mb-2"
                >
                  Reset
                </button>
                <p className="mb-2 text-light"></p>
                Already have an account?{' '}
                <NavLink to="/login">
                  <p className="text-muted">Login</p>
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
