import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => { //thunk middleware
    const id = uuidv4(); //generates random long string (id)
    dispatch({ // dispatches type of alert to reducer (/reducer/alert.js)
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    setTimeout(() => dispatch({ 
        type: REMOVE_ALERT,
        payload: id
    }), timeout ); // after 5 seconds, REMOVE_ALERT will get dispatched
};