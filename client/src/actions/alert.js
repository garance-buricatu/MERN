import { SET_ALERT, REMOVE_ALERT } from './types';
import uuid from 'uuid';

export const setAlert = (msg, alertType) => dispatch => { //thunk middleware
    const id = uuid.v4(); //returns random long string (id)
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });
}