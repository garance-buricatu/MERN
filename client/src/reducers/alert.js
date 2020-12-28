import { SET_ALERT, REMOVE_ALERT } from '../actions/types';
const initialState = [];

export default function(state = initialState, action) {
    // action is an object that has both type and payload attached to it
    const { type, payload } = action;
    
    switch(type) { // depending on type, decide what state to send down
        case SET_ALERT: 
            return [...state, payload]; // state getting passed down to the component
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload); // returns all alerts except the one that matches the payload
        default:
            return state;
    }
}