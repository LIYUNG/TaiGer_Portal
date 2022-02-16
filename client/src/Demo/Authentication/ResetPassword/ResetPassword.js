import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./../../../assets/scss/style.scss";
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
import DEMO from "../../../store/constant";
import { resetPassword } from "../../../api/auth";

export default function ResetPassword(props) {
  const query = new URLSearchParams(props.location.search);
  console.log(query.get("email"));
  const [email, setEmail] = useState(query.get("email"));
  const [token, setToken] = useState(query.get("token"));
  const [passwordchanged, setPasswordchanged] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const passwordValidation = () => {
    if (password === "") return false;
    if (password.length < 8) return false;
    var decimal =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (decimal.test(password) === false) return false;
    // const regex =
    //   /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    // if (!email || regex.test(email) === false) {
    //   return false;
    // }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordValidation()) {
      try {
        // check 2 password match
        if (password === passwordRepeat) {
          const resp = await resetPassword({
            email,
            password,
            token,
          });
          const { success } = resp.data;
          if (success) {
            console.log("Password change success");
            setPasswordchanged(true);
          }
        } else {
          alert("Password did not match!");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Password is not valid");
    }
  };
  if (passwordchanged) {
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
            <div className="card">
              <div className="card-body text-center">
                <h5 className="mb-3">Password change successfully!</h5>
                <p className="mb-0 text-muted">
                  Please login with your new password
                  <NavLink to="/auth/signin-1">Login</NavLink>
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
            <div className="auth-bg">
              <span className="r" />
              <span className="r s" />
              <span className="r s" />
              <span className="r" />
            </div>
            <form className="card" onSubmit={handleSubmit}>
              <div className="card-body text-center">
                <div className="mb-4">
                  <i className="feather icon-user-plus auth-icon" />
                </div>
                <h3 className="mb-4">Reset Password</h3>
                <h5 className="mb-3">Enter New Password</h5>
                <p>
                  Password must contain at least:
                  <br />- 1 Uppercase
                  <br />- 1 Lowercase
                  <br />- 1 number
                  <br />- 1 special character
                  <br />- length of 8 characterv
                </p>
                <div className="input-group mb-4">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <h5 className="mb-3">Enter New Password Again</h5>
                <div className="input-group mb-4">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="password"
                    onChange={(e) => setPasswordRepeat(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary shadow-2 mb-4">
                  Reset
                </button>
                <p className="mb-0 text-muted">
                  Allready have an account?{" "}
                  <NavLink to="/auth/signin-1">Login</NavLink>
                </p>
              </div>
            </form>
          </div>
        </div>
      </Aux>
    );
  }
}
