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
//Whenever access is Private, auth is used as a parameter
//Auth is the middleware function that we created in a new file
router.get('/', auth, async (req, res) => {
  try {
    //Getting User from Database
    // "-password" means we are getting the data from our database having given id, but since we dont want password back, we have subtracted it
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

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

module.exports = router;
