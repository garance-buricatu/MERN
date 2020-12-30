import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const PrivateRoute = ({ 
    component: Component, 
    auth: {isAuthenticated, loading},
     ...rest 
    }) => (
    <Route 
        { ...rest } 
        render={ props => 
            !isAuthenticated && !loading ? ( // if user is not authenticated and not loading --> redirect to login page
                <Redirect to='/login' />
            ) : (
                <Component {...props} /> // otherwise, component will load
            )
        }
    />
);

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth // get state from auth reducer
});

export default connect(mapStateToProps)(PrivateRoute);
