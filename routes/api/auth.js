const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('config');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @route  GET api/auth
// @desc   Validate token and load user
// @access Public
router.get('/', auth,  async (req, res) => { // adding "auth" as a parameter makes this route protected
    //res.send('Auth route')

    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}); 

// @route  POST api/auth
// @desc   Login User and get token
// @access Public
router.post('/', 
[
    // validate using express-validator
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please is required').exists()
], 
async (req, res) => {

    // checking for correct formatting of POST request
    const errors = validationResult(req);
    if (!errors.isEmpty()){ // bad request and return above error messages
        return res.status(400).json({ errors: errors.array()});
    }
    // console.log(req.body); --> in postman, when api is called, body is sent with POST request. this displays the body
    
    // destructure req.body (neater use)
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email }); // NOTE: any functiont hat returns a promise should use "await"
        if (!user) {
            return res.status(400).json({ errors: [ {msg: 'Invalid Credentials'} ] });
        }

        // need to match email and password
        const isMatch = await bcrypt.compare(password, user.password); //1st param - plain text passwordm 2nd param - encrypted password (obtain after making request to the database)
        if (!isMatch){
            return res.status(400).json({ errors: [ {msg: 'Invalid Credentials'} ] });
        }

        // return jsonwebtoken
        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token }) //jwt that has the user id payload
            });
        // Now, need to send that token back to authenticate an access protected route (by creating custom middleware)

        //res.send('User registered'); // return value if credentials are validated

    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;