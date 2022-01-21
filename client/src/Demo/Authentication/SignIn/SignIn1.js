import "./../../../assets/scss/style.scss";
import Aux from "../../../hoc/_Aux";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { login } from "../../../api";

// export default function Signin1({ setToken }) {
export default function Signin1({ userData, setUserdata }) {
  const [emailaddress, setEmailaddress] = useState();
  const [password, setPassword] = useState();
  const [buttondisable, setButtondisable] = useState(false);
  const emailValidation = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!emailaddress || regex.test(emailaddress) === false) {
      return false;
    }
    return true;
  };
  const setuserdata2 = (resp) => {
    try {
      if (resp) {
        if (resp.status === 400) {
          alert("This Email is already registered.");
        } else if (resp.status === 401) {
          alert("Password is not correct.");
          setButtondisable(false);
        } else {
          console.log("successfullllll");
          setUserdata((state) => ({
            ...state,
            success: resp.data.success,
            data: resp.data.data,
            isloaded: true,
          }));
        }
      } else {
        alert("Email or password not correct.");
        setButtondisable(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailValidation()) {
      if (!password) {
        alert("Password please!");
      } else {
        try {
          const resp = await login({ email: emailaddress, password });
          // console.log(resp);
          setuserdata2(resp);
        } catch (err) {
          // TODO: handle error
          console.log(err);
        }
      }
    } else {
      alert("Email is not valid");
    }
  };

  const onButtonClick = async (e, buttondisable) => {
    e.preventDefault();
    setButtondisable(buttondisable);
    handleSubmit(e);
  };

  return (
    <Aux>
      <div className="auth-wrapper">
        <div className="auth-content">
          {/* <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div> */}
          <form className="card">
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="feather icon-unlock auth-icon" />
              </div>
              <h3 className="mb-4"> TaiGer - Portal</h3>
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
              <button
                disabled={!emailaddress || !password || buttondisable}
                onClick={(e) => onButtonClick(e, true)}
                type="submit"
                className="btn btn-primary shadow-2 mb-4"
              >
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
