import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import {
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT
} from './types';

// load user - given a token (stored in local storage), call /api/auth api to validate token and load user
export const loadUser = () => async dispatch => {
    
    // check local storage for token and add to x-auth-token header, see utils/setAuthToken.js
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/api/auth');
        dispatch({
            type: USER_LOADED,
            payload: res.data // the user
        })
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
};

// register user --> in Register.js, we call register with name, email, and password send in body of /api/users endpoint
export const register = ({ name, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type':'application/json' 
        }
    }

    const body = JSON.stringify({ name, email, password });

    try {
        const res = await axios.post('/api/users', body, config); // calling POST endpoint with body and headers
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data // the token
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))); // prints errors returned by endpoint
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
};

// Login user --> in Login.js, call login() with email and password sent with body of api/auth endpoint
export const login = ( email, password ) => async dispatch => {
    const config = {
        headers: {
            'Content-Type':'application/json' 
        }
    }

    const body = JSON.stringify({ email, password });

    try {
        const res = await axios.post('/api/auth', body, config); // calling POST endpoint with body and headers
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data // the token
        });
        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))); // prints errors returned by endpoint
        }

        dispatch({
            type: LOGIN_FAIL
        })
    }
};

// Logout /clear profile
export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
};