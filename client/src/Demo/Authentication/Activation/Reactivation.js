import React from 'react';
import PropTypes from 'prop-types';
import './../../../assets/scss/style.scss';
import Aux from '../../../hoc/_Aux';
import { resendActivation } from '../../../api/index';
import taiger_logo from '../../../assets/images/taiger_logo.png';
import Footer from '../../../components/Footer/Footer';

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
                <p className="mb-2">Confirmation Email sent</p>
                <div className="input-group mb-2">
                  <p className="mb-0 text-success">
                    The new activation link is sent to the following address:
                  </p>
                </div>
                <p className="mb-4 text-secondary">{props.email}</p>
              </div>
            </form>
          </div>
        </div>
        <Footer />
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
                  className="img-radius"
                  src={taiger_logo}
                  alt="Generic placeholder"
                />
                <p className="mb-4"></p>
                <p className="mb-4">Account is not activated</p>
                <div className="input-group mb-4">
                  <p className="mb-0 text-success">
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
        <Footer />
      </Aux>
    );
  }
}

Reactivation.propTypes = {
  setToken: PropTypes.func.isRequired
};
