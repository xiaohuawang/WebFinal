import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../config/config';
import User from '../models/user.model'

// sample user, used for authentication

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  // Ideally you'll fetch this from the db
  // Idea here was to show how jwt works with simplicity
  if (req.body.token) {
    let decoded = jwt.verify(req.body.token, config.jwtSecret);
    return User.get(decoded.id).then(user => {
      return res.json(user)
    })
  }
  return User.findByName(req.body.username).then((users) => {
    let user = users[0];
    if (user.password === req.body.password) {
      const token = jwt.sign({
        id: user._id,
      }, config.jwtSecret);
      return res.json({
        token,
        username: user.username,
        status: user.status
      });
    }
    const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
    return next(err);
  }).catch(er => {
    return next(er)
  })
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export function getUserId(req) {
  try {
    return jwt.verify(req.cookies.token, config.jwtSecret).id
  } catch (e) {
    throw new Error('Not login')
  }
}

export default { login, getRandomNumber, getUserId };
