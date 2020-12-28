import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

// import axios from 'axios';

export const Register = () => {
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
            console.log('Passwords do not match');
        }
        else {

            // EX - calling a backend API - will happen with redux
            // const newUser = {
            //     name, //same as name:name
            //     email,
            //     password
            // }

            // try {
            //     const config = {
            //         headers: {
            //             'Content-Type': 'Application/json'
            //         }
            //     }
            //     const body = JSON.stringify(newUser);

            //     //Register user route
            //     const res = await axios.post('/api/users', body, config);
            //     console.log(res.data); // should output token

            // } catch (err) {
            //     console.error(err.response.data);
            // }
            
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
                    required />
                </div>
                <div className="form-group">
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    name="email"
                    value={email}
                    onChange = {e => onChange(e)}
                    required />
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
                    minLength="6"
                    value={password} 
                    onChange = {e => onChange(e)} 
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    minLength="6"
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

export default Register
