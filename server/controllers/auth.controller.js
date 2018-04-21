import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../config/config';
import User from '../models/user.model'

function login(req, res, next) {
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
