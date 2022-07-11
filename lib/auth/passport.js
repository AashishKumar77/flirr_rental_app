'use strict'

import passport from 'passport';
import jwt from 'jsonwebtoken';
import config from 'config';

import Admin from '../../collections/admin/index.js';
const { superadmin } = config.get('roles');
const secret = config.get('secret');
import { messages, responseCodes } from '../../constants.js';


//Import Strategies
import passport_jwt from 'passport-jwt';
const JwtStrategy = passport_jwt.Strategy;
const ExtractJwt = passport_jwt.ExtractJwt;

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secret.jwt;

passport.use('jwt', new JwtStrategy(opts, async (jwt_payload, next) => {
  let user = '';
  let err = '';
  //ToDo: Token expiry date need to be matched
  try {
    console.log(jwt_payload,"jwt_payload")
    if (jwt_payload.role == superadmin) {
      user = await Admin.findOneByCondition({ email: req.body.email }).select({ username: 1 });
    }
    // Assign Role
    user = JSON.parse(JSON.stringify(user));
    user.role = jwt_payload.role;
  } catch (error) {
    err = error;
  } finally {
    if (err) {
      return next(null, err, { message: 'Some error occurred.' });
    } else if (!user) {
      return next(null, false, { message: 'Token is not valid.' });
    } else {
      return next(null, user, { message: 'Access successful.' });
    }
  }
}));

//}

// Serialize User
// For Saving in Session
passport.serializeUser(async (user, done) => {
  done(null, user);
});

// Deserialize User
// For Fethcing From Session
passport.deserializeUser(async (user, done) => {
  done(null, user);
});


//JWT token verification
export const verifyToken = async (req, res, next) => {
  
  var jwtSecretKey = secret.jwt;
  //get the auth header value
  const bearerHeader = req.headers['authorization'];
  //check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    //split by space
    const bearer = bearerHeader.split(' ');
    //get token from array
    const bearerToken = bearer[1];
    //validating the token
    jwt.verify(bearerToken, jwtSecretKey, async (err, decoded) => {
      if (!err) {
        let user = {};
        user = { ...decoded, role: decoded.role ? decoded.role :1};
        req.user = user;
        next();
      } //err
      else {
        return res.status(responseCodes.forbidden).json({
          statusCode: responseCodes.forbidden,
          message: messages.tokenIsNotValid
        });
      }
    });
  }
  else {
    return res.status(responseCodes.internalServerError).json({
      statusCode: responseCodes.internalServerError,
      message: messages.authTokenNotProvided
    });
  }

};
