const jwt = require('jsonwebtoken');
const config = require('config');

// a middleware function that has access to req and res objects
// next is a callback that needs to be run so that it moves on to the next piece of middleware
module.exports = function(req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token'); // obtaining token from header

    // Check if no token
    if (!token) {
        return res.status(401).json({ mesg: "No token, authorization denied"});
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret')); // verify function decodes token
        req.user = decoded.user; // user is in the payload
        next();
    } catch(err) {
        res.status(401).json({ msg: "Token is not valid"});
    }
}