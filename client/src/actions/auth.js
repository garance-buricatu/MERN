import axios from 'axios';
import { setAlert } from './alert';
import {
    REGISTER_FAIL,
    REGISTER_SUCCESS
} from './types';

// register user
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
            payload: res.data // token
        });
    } catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger'))); // prints errors returned by endpoint
        }

        dispatch({
            type: REGISTER_FAIL
        })
    }
}