import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'

// redux
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';

// import axios from 'axios';

export const Register = ({ setAlert, register }) => {
    const [formData, setFormData] = useState({
        name: '',
        email:'',
        password:'',
        password2:''
    });

    const { name, email, password, password2 } = formData;

    // e.target.name and e.target.value gets the specific name and value of the given field (input)
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value }); //spread operator copies contanets of formData and changes "name" attribute only

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2){
            // call action when passwords do not match --> send message and alert type --> see actions/alert.js
            setAlert('Passwords do not match', 'danger');
        }
        else {

           // call register action
           register({
               name, // pulled from formData
               email,
               password
           });
            
            console.log('SUCCESS!');
        }
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i class="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Name" 
                    name="name" 
                    value={name} 
                    onChange = {e => onChange(e)} 
                    />
                </div>
                <div className="form-group">
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    name="email"
                    value={email}
                    onChange = {e => onChange(e)}
                    />
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small
                >
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password} 
                    onChange = {e => onChange(e)} 
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    value={password2} 
                    onChange = {e => onChange(e)} 
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
}

{/* need to add the setAlert action here to make it avaliable within "props" parameter above, wchih has been destructured*/}
export default connect(
    null, 
    { setAlert, register } 
)(Register);
