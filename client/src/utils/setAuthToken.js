import axios from 'axios';

// funciton that takes in token
// if token exists in local storage, add to gloabal header
// if not, delete from global header

const setAuthToken = token => {
    if(token){ // if token exists in local storage
        axios.defaults.headers.common['x-auth-token'] = token;
    }
    else {
        delete axios.defaults.headers.common['x-auth-token'];
    }
}

export default setAuthToken;