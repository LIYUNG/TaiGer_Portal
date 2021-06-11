import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import './../../../assets/scss/style.scss';
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
// import DEMO from "../../../store/constant";

async function registerUser(credentials) {
    // return fetch('https://54.214.118.145/login', {
    return fetch('http://localhost:2000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
        // .then(res => {
        //     if (res.status === 200) {
        //         this.props.history.push('/');
        //     } else {
        //         const error = new Error(res.error);
        //         throw error;
        //     }
        // })
        .catch(err => {
            console.error(err);
            alert('Error at registration!');
        })
}


// class SignUp1 extends React.Component {
export default function SignUp1({ setToken }) {
    const [emailaddress, setEmailaddress] = useState();
    const [password, setPassword] = useState();
    const [passwordconfirm, setPasswordConfirm] = useState();
    const [firstname, setFirstname] = useState();
    const [lastname, setLastname] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        if (!firstname) {
            alert('First name, please!');
        } else {
            if (!lastname) {
                alert('Last name, please!');
            } else {
                if (!emailaddress) {
                    alert('Email, please!');
                }
                else {
                    if (password && passwordconfirm) {
                        if (password === passwordconfirm) {
                            const token = await registerUser({
                                firstname,
                                lastname,
                                emailaddress,
                                password
                            });
                            setToken(token);
                        } else {
                            alert('Password not matched!');
                        }
                    }
                    else{
                        alert('Please enter passwords');
                    }
                }
            }
        }
    }




    // render() {
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
                            <h3 className="mb-4">Sign up</h3>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="First name" onChange={e => setFirstname(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Last name" onChange={e => setLastname(e.target.value)} />
                            </div>
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Email" onChange={e => setEmailaddress(e.target.value)} />
                            </div>
                            <div className="input-group mb-4">
                                <input type="password" className="form-control" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                            </div>
                            <div className="input-group mb-4">
                                <input type="password" className="form-control" placeholder="Password confirmation" onChange={e => setPasswordConfirm(e.target.value)} />
                            </div>
                            {/* <div className="form-group text-left">
                                <div className="checkbox checkbox-fill d-inline">
                                    <input type="checkbox" name="checkbox-fill-2" id="checkbox-fill-2" />
                                    <label htmlFor="checkbox-fill-2" className="cr">Send me the <a href={DEMO.BLANK_LINK}> Newsletter</a> weekly.</label>
                                </div>
                            </div> */}
                            <button className="btn btn-primary shadow-2 mb-4">Sign up</button>
                            <p className="mb-0 text-muted">Allready have an account? <NavLink to="/auth/signin-1">Login</NavLink></p>
                        </div>
                    </form>
                </div>
            </div>
        </Aux>
    );
    // }
}

// export default SignUp1;

SignUp1.propTypes = {
    setToken: PropTypes.func.isRequired
}