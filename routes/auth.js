//Registration is complete in users.js.
//Now what we want to do is to be able to login to get a token as well.

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
//This validator is used to validate the credentials for logging in the account

const User = require('../models/User');

// @route     GET api/auth
// @desc      Get logged in User
// @access   Private

//Whenever we need to protect a route, we will bring in our middleware.
//The way we use middleware is pass it as a second parameter.
//now we cannot make a get request to api/users just like that. we need to pass in token and verify it.

//Whenever access is Private, auth is used as a parameter
//Auth is the middleware function that we created in a new file
router.get('/', auth, async (req, res) => {
  try {
    //Getting User from Database
    // "-password" means we are getting the data from our database having given id, but since we dont want password back, we have subtracted it
    //req.user has the id we need since we had updater the req.user in the middleware corresponding to the token we had passed in
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Auth user and get token
// @access   Public
//What this post method does is it returns a JSONWebToken if we enter the correct Id and Password
//Firsty we check if a valid password and email is entered or not.
//In try, if we have entered an email that does not exist or wrong password for that email, we get a message of "Invalid Credentials"
//If everything is right, we will receive out JsonWebToken.
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    //checking entries using validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructure email and password
    const { email, password } = req.body;

    try {
      //find if a user exist with given email id. if it does, then continue, else return
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
      //if user exist, check if the entered password and user's password match. and if they do, then continue.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      //Object we want to send in the token.
      //we want to send only id because using id, we can access all the contacts a logged in user has.
      //make a token and return it just like in users.js
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//now we have got the token. We now need a piece of middleware to validate the token and pull out the user id.

module.exports = router;
