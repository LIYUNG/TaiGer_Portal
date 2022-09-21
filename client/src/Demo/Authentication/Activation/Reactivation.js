import React from 'react';
// import { NavLink, Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './../../../assets/scss/style.scss';
import Aux from '../../../hoc/_Aux';
import Breadcrumb from '../../../App/layout/AdminLayout/Breadcrumb';
import { resendActivation } from '../../../api';

export default function Reactivation(props) {
  // const query = new URLSearchParams(props.location.search);
  // const [email, setEmail] = useState(query.get('email'));
  const [emailsent, setEmailsent] = React.useState(false);

  // useEffect(() => {
  //   activation(email, token).then((res) => {
  //     const { success } = res.data;
  //     if (success) {
  //       setEmailsent(true);
  //     } else {
  //       alert(res.data.message);
  //     }
  //   });
  // }, []);

  //TODO: default call API to get token

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailsent(true);
    try {
      const resp = await resendActivation({
        email: props.email
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

  // if return 200, then show Start button, otherwise, resend the activation email with token.
  if (emailsent) {
    return (
      <Aux>
        <Breadcrumb />
        <div className="auth-wrapper">
          <div className="auth-content">
            <form className="card">
              <div className="card-body text-center">
                {/* <div className="mb-4">
                  <i className="feather icon-user-plus auth-icon" />
                </div> */}
                <h3 className="mb-4">Confirmation Email sent</h3>
                <div className="input-group mb-4">
                  <p className="mb-0 text-muted">
                    The new activation link is sent to the following address:
                  </p>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    readonly="readonly"
                    value={props.email}
                  />
                </div>
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
            <form className="card" onSubmit={handleSubmit}>
              <div className="card-body text-center">
                <h3 className="mb-4">Account is not activated</h3>
                <div className="input-group mb-4">
                  <p className="mb-0 text-muted">
                    Please click "Resend" to receive the new activation link in
                    your email.
                  </p>
                </div>
                <button
                  className="btn btn-primary shadow-2 mb-4"
                  onClick={(e) => handleSubmit(e)}
                >
                  Resend
                </button>
              </div>
            </form>
          </div>
        </div>
      </Aux>
    );
  }
}

Reactivation.propTypes = {
  setToken: PropTypes.func.isRequired
};
