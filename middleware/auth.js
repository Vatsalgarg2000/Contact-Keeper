//We are able to register a user or login to get a token. But what good good is this token actually.
//So we will now create some middleware that will allow us to send this token in header when we are
//trying to acces a protected route to view the user's contacts

//This file is used only in get request auth.js  in routes folder.

//So it just a function that has access to the request and response cycle and request and response object.
//so everytime we hit an endpoint, we can fire off this middleware and we want to check to see if there is
//a token in header.

const jwt = require('jsonwebtoken');
const config = require('config');

//All this file does is check if the token that we entered exists or not.

//In middleware function, we always need this next function which means to to move onto to next piece of middleware
module.exports = function (req, res, next) {
  //Get token from header
  const token = req.header('x-auth-token');

  //Check if token exists
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    //verify the token and pull out the payload.
    //that is, check if a user exists with a given token and return that user.
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    //Once it gets verified, the object/payload is gonna put into an object.
    //We want to get the user out which only has id and we want to assign it to req.user.

    //we assigned it so that it has access to the pulled user inside the routes.
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
