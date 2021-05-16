import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import './Login.css';
// import './bootstrap/css/bootstrap.min.css';
// import './font-awesome/css/font-awesome.min.css';
// import './form-elements.css';
// import './style.css';

import { NavLink } from 'react-router-dom';

import './../../assets/scss/style.scss';
import Aux from "../../hoc/_Aux";
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

export default function Login({ setToken }) {
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
        //     <div className="top-content">
        //     <div className="inner-bg">
        //         <div className="container">
        //             <div className="row">
        //                 <div className="col-sm-8 col-sm-offset-2 text">
        //                     <h1><strong>TaiGer</strong> Consultancy</h1>
        //                     <div className="description">
        //                         <p>
        //                             Study in Germany.
        //       </p>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="row">
        //                 <div className="col-sm-6 col-sm-offset-3 form-box">
        //                     <div className="form-top">
        //                         <div className="form-top-left">
        //                             <h3>Login to our site</h3>
        //                             <p>Enter your username and password to log on:</p>
        //                         </div>
        //                         <div className="form-top-right">
        //                             <i className="fa fa-key" />
        //                         </div>
        //                     </div>
        //                     <div className="form-bottom">
        //                         <form className="login-form" onSubmit={handleSubmit} >
        //                             <div className="form-group">
        //                                 <label className="sr-only" htmlFor="form-username">Username</label>
        //                                 <input type="text" name="emailaddress" placeholder="E-mail" className="form-username form-control" id="form-username" onChange={e => setEmailaddress(e.target.value)} />
        //                             </div>
        //                             <div className="form-group">
        //                                 <label className="sr-only" htmlFor="form-password">Password</label>
        //                                 <input type="password" name="password" placeholder="Password" className="form-password form-control" id="form-password" onChange={e => setPassword(e.target.value)} />
        //                             </div>
        //                             <button type="submit" className="btn">登入</button>
        //                             <div className="form-group">
        //                                 <h3>Don't you have a TaiGer account?</h3>
        //                                 <a style={{ color: 'darkblue' }} href="register"><p>Sign up</p></a>
        //                                 <a style={{ color: 'darkblue' }} href="password"><p>Forget password?</p></a>
        //                             </div>
        //                         </form>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>





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
                            <h3 className="mb-4"> TaiGer - Portal</h3>
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

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}