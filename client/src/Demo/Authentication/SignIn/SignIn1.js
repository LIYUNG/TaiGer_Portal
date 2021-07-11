import "./../../../assets/scss/style.scss";
import Aux from "../../../hoc/_Aux";

import React, { useState } from "react";
import PropTypes from "prop-types";

import { NavLink } from "react-router-dom";

// import Breadcrumb from "../../App/layout/AdminLayout/Breadcrumb";

async function loginUser(credentials) {
  return (
    fetch(window.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      // .then(res => {
      //     if (res.status === 401) {
      //         console.error("unauthorized!");
      //         const error = new Error(res.error);
      //         throw error;
      //     }
      // })
      .then((data) => data.json())
      // .then((data) => {
      //     console.log(data)
      //     Promise.resolve(data ? data : {})
      // })
      // .then(data => data.json())
      .catch((err) => {
        // console.error(err);
        // alert('Email or password not correct.');
      })
  );
}

export default function Signin1({ setToken }) {
  const [emailaddress, setEmailaddress] = useState();
  const [password, setPassword] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailaddress) {
      alert("Email, please!");
    } else {
      if (!password) {
        alert("Password please!");
      } else {
        const token = await loginUser({
          emailaddress,
          password,
        });
        setToken(token);
      }
    }
  };

  return (
    <Aux>
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
                <i className="feather icon-unlock auth-icon" />
              </div>
              <h3 className="mb-4"> TaiGer - Portal2</h3>
              <p> Study in Germany</p>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={(e) => setEmailaddress(e.target.value)}
                />
              </div>
              <div className="input-group mb-4">
                <input
                  type="password"
                  className="form-control"
                  placeholder="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary shadow-2 mb-4">
                Login
              </button>
              <p className="mb-2 text-muted">
                Forgot password?{" "}
                <NavLink to="/auth/reset-password-1">Reset</NavLink>
              </p>
              <p className="mb-0 text-muted">
                Don’t have an account?{" "}
                <NavLink to="/auth/signup-1">Sign up</NavLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Aux>
  );
}

Signin1.propTypes = {
  setToken: PropTypes.func.isRequired,
};
