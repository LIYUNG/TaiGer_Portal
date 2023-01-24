import React, { useState, useEffect } from 'react';
// import { NavLink, Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './../../../assets/scss/style.scss';
import Aux from '../../../hoc/_Aux';
import Breadcrumb from '../../../App/layout/AdminLayout/Breadcrumb';
import { activation, resendActivation } from '../../../api/index';
import taiger_logo from '../../../assets/images/taiger_logo.png';
import Footer from '../../../components/Footer/Footer';

export default function Activation(props) {
  const query = new URLSearchParams(props.location.search);
  const [email, setEmail] = useState(query.get('email'));
  const [token, setToken] = useState(query.get('token'));
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
  }, []);

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
      // console.log(err);
    }
  };

  const handleonClick = async (e) => {
    window.location.reload(false);
  };
  // if return 200, then show Start button, otherwise, resend the activation email with token.
  if (activationsuccess) {
    return (
      <Aux>
        <Breadcrumb />
        <div className="auth-wrapper">
          <div className="auth-content">
            <form>
              <div className="card-body text-center">
                <img
                  className="img-radius"
                  src={taiger_logo}
                  alt="Generic placeholder"
                />
                <p className="mb-4">Account activated</p>
                <div className="input-group mb-4">
                  <p className="mb-0 text-success">
                    You have activated the account successfully!
                  </p>
                </div>
                <button
                  className="btn btn-primary shadow-2 mb-4"
                  onClick={() => handleonClick()}
                >
                  Start
                </button>
              </div>
            </form>
          </div>
        </div>
      </Aux>
    );
  } else {
    if (emailsent) {
      return (
        <Aux>
          <Breadcrumb />
          <div className="auth-wrapper">
            <div className="auth-content">
              <form>
                <div className="card-body text-center">
                  <img
                    className="img-radius"
                    src={taiger_logo}
                    alt="Generic placeholder"
                  />
                  <p className="mb-4 mb-2 text-light"></p>
                  <p className="mb-2 text-light">Confirmation Email sent</p>
                  <div className="input-group mb-2">
                    <p className="mb-0 text-success">
                      The new activation link is sent to the following address:
                    </p>
                  </div>
                  <p className="mb-4 text-muted">{email}</p>
                </div>
                <Footer />
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
              <form>
                <div className="card-body text-center">
                  <img
                    className="img-radius"
                    src={taiger_logo}
                    alt="Generic placeholder"
                  />
                  <p className="mb-4"></p>
                  <p className="mb-4">Link Expired</p>
                  <div className="input-group mb-4">
                    <p className="mb-0 text-muted">
                      The activation link is expired. Please request another
                      activation link!
                    </p>
                  </div>
                  <button
                    className="btn btn-primary shadow-2 mb-4"
                    onClick={(e) => handleResendSubmit(e)}
                  >
                    Resend
                  </button>
                </div>
                <Footer />
              </form>
            </div>
          </div>
        </Aux>
      );
    }
  }
}

Activation.propTypes = {
  setToken: PropTypes.func.isRequired
};
