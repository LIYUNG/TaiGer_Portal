// import {NavLink} from 'react-router-dom';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { NavLink } from 'react-router-dom';

// import Breadcrumb from "../../App/layout/AdminLayout/Breadcrumb";

async function loginUser(credentials) {
    return fetch('http://localhost:2000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
    // .then(res => {
    //     if(res.status === 200)
    //     {
    //         this.props.history.push('/');
    //     }else{
    //         const error = new Error(res.error);
    //         throw error;
    //     }
    // })
    // .catch(err => {
    //     console.error(err);
    //     alert('Error logging in please try again');
    // })
}

export default function Signin1({ setToken }) {
    const [emailaddress, setEmailaddress] = useState();
    const [password, setPassword] = useState();
    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            emailaddress,
            password
        });
        setToken(token);
    }

    return (
        <Aux>
            {/* <Breadcrumb /> */}
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
                                <input type="email" className="form-control" placeholder="Email" onChange={e => setEmailaddress(e.target.value)} />
                            </div>
                            <div className="input-group mb-4">
                                <input type="password" className="form-control" placeholder="password" onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="form-group text-left">
                                <div className="checkbox checkbox-fill d-inline">
                                    <input type="checkbox" name="checkbox-fill-1" id="checkbox-fill-a1" />
                                    <label htmlFor="checkbox-fill-a1" className="cr"> Save credentials</label>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary shadow-2 mb-4">Login</button>
                            <p className="mb-2 text-muted">Forgot password? <NavLink to="/auth/reset-password-1">Reset</NavLink></p>
                            <p className="mb-0 text-muted">Don’t have an account? <NavLink to="/auth/signup-1">Signup</NavLink></p>
                        </div>
                    </form>
                </div>
            </div>
        </Aux>
    )
}

Signin1.propTypes = {
    setToken: PropTypes.func.isRequired
}