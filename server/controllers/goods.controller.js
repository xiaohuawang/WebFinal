import Good from '../models/good.model';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../config/config';
import { getUserId } from './auth.controller'
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  Good.get(id)
    .then((good) => {
      req.good = good;
      return next();
    })
    .catch(e => next(e));
}

function get(req, res) {
  return res.json(req.good);
}

function superget(req, res) {
  return Good.superget(req.good._id).then((e) => {
    res.json(e)
  })
}


function create(req, res, next) {
  const good = new Good({
      name: req.body.name,
      seller: getUserId(req),
      description: req.body.description,
      price: req.body.price,
      imgSrc: req.body.imgSrc
  });

  good.save()
    .then(savedGood => res.json(savedGood))
    .catch(e => next(e));
}

function update(req, res, next) {
  const good = req.good;
  good.name = req.good.name;
  good.description = req.good.description;
  good.price = req.good.price;
  good.imgSrc = req.good.imgSrc;

  good.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { type = 0, limit = 50 } = req.query;

  if (!getUserId(req)) {
    next(new Error("not logined"))
  }
  let user_id = getUserId(req);
  Good.list({ type, limit, user_id})
    .then(goods => res.json(goods))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const good = req.good;
  good.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

function profile(req, res, next) {
  if (req.cookies.token) {
    let decoded = jwt.verify(req.cookies.token, config.jwtSecret);
    User.get(decoded.id).then(user => {
      return res.json(user);
    })
  }
}
export default { load, get, create, update, list, remove, profile , superget};
