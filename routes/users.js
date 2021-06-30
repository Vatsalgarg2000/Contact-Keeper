const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator'); //used for checking if the the fields entered are correct or not. eg->check('name', 'Please add name').not().isEmpty(),

//The schema we have imported is used for making new users
const User = require('../models/User');

// @route     POST api/users
// @desc      Register a user
// @access   Public
//What this post method does is it registers a user
//Firsty we check if a valid name, password and email is entered or not.
//In try, if we have entered an email that already exists, we get a message of "User already exists"
//If everything is right, a new user is created and registered and we will receive out JsonWebToken for logging in the account later on.

//The '/' perstains to api/users only
//So 3 parameters are there, 1st the route, 2nd the checking using express validator, 3rd the funtion.
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a passord with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      //Creating new instance of User
      user = new User({
        name,
        email,
        password,
      });

      //Hashing the password using bcrypt before saving it.
      //Creating a salt(general syntax) and using it to hash the password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //save the updated password in database.
      await user.save();

      //Till now user has been created and saved.

      //We want to handle the correct response as well for logging in.
      //We want to login right away when we register within react in front end.
      //So to do that, we need to get a token sent. We basically need a JSON Web token
      //and send it to the client so that they can store it and bacially access protected routes.

      //Object we want to send in the token.
      //we want to send only id because using id, we can access all the contacts a logged in user has.
      const payload = {
        user: {
          id: user.id,
        },
      };

      //To generate a token, first we have to sign it.
      //The expire parameter is not necessary but it is good that the session expires after some time.

      //So the when we register a user, we make a token that contains logged in user's id and we
      //use it for pretty much everything.
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          //if there is an error throw it.
          if (err) throw err;
          //else return the token.
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//After doing all this, what we need to do is create a piece of middleware that will extract this, first
//of all check the token send in the header and extract the id from it and do what we want to do.

module.exports = router;
