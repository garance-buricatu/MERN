const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route  POST api/users
// @desc   Register User
// @access Public
router.post('/', 
[
    // validate using express-validator
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({min : 6})
], 
async (req, res) => {

    // checking for correct formatting of POST request
    const errors = validationResult(req);
    if (!errors.isEmpty()){ // bad request and return above error messages
        return res.status(400).json({ errors: errors.array()});
    }

    // destructure req.body (neater use)
    const { name, email, password } = req.body; // need middleware to access req.body

    try {
        // See if the user exists (duplicated user --> error)
        let user = await User.findOne({ email }); 
        // NOTE: any function that returns a promise should use "await" AND outer function must be labeled as "async"
        if (user) { // if user exists
            return res.status(400).json({ errors: [ {msg: 'User already Exists'} ]});
        }

        // Get user's gravatar (based on email)
        const avatar = gravatar.url(email, {
            s: '200', //default size
            r: 'pg', //rating
            d: 'mm' //default
        })

        user = new User({ // creates new instance of user (does not save it to the database)
            name,
            email,
            avatar,
            password
        })

        // Encrypt the password using bcrypt
        const salt = await bcrypt.genSalt(10); // hash function for password (see doc)
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // return jsonwebtoken --> in the frontend, when the user registers, this allows user to get logged in right away after registering 
        // (need web token to login)
        const payload = {
            user: {
                id: user.id //_id of saved user (mongoose allows for "id" field instead of "_id")
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