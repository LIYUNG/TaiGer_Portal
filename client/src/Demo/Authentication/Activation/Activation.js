import React, { useState, useEffect } from 'react';
import { NavLink, Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './../../../assets/scss/style.scss';
import Aux from '../../../hoc/_Aux';
import Breadcrumb from '../../../App/layout/AdminLayout/Breadcrumb';
import { activation } from '../../../api';

export default function Activation(props) {
  const query = new URLSearchParams(props.location.search);
  const [email, setEmail] = useState(query.get('email'));
  const [token, setToken] = useState(query.get('token'));
  const [activationsuccess, setActivationSuccess] = React.useState(false);

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
            <div className="auth-bg">
              <span className="r" />
              <span className="r s" />
              <span className="r s" />
              <span className="r" />
            </div>
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="feather icon-user-plus auth-icon" />
              </div>
              <h3 className="mb-4">Confirmation Email sent</h3>
              <div className="input-group mb-4">
                <p className="mb-0 text-muted">
                  You have activated the account successfully!
                </p>
              </div>
              <button onClick={() => handleonClick()}>Start</button>
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
            <div className="auth-bg">
              <span className="r" />
              <span className="r s" />
              <span className="r s" />
              <span className="r" />
            </div>
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="feather icon-user-plus auth-icon" />
              </div>
              <h3 className="mb-4">Link Expired</h3>
              <div className="input-group mb-4">
                <p className="mb-0 text-muted">
                  The activation link is expired. Please request another
                  activation link!
                </p>
              </div>
              <button className="btn btn-primary shadow-2 mb-4">Resend</button>
            </div>
          </div>
        </div>
      </Aux>
    );
  }
}

Activation.propTypes = {
  setToken: PropTypes.func.isRequired
};
