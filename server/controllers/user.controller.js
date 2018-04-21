import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import config from '../config/config';
import {getUserId} from './auth.controller'
/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    status: Number(req.body.status)
  });

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

function update(req, res, next) {
  const user = req.user;
  user.username = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  user.description = req.body.description;
  user.money = req.body.money;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

function remove(req, res, next) {
  const user = req.user;
  user.remove()
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

function cart(req, res, next) {
  if (req.cookies.token) {
    let decoded = jwt.verify(req.cookies.token, config.jwtSecret)
    User.getCart(decoded.id).then(user => {
      return res.json(user)
    })
  }
}


function addToCart(req, res, next) {
  if (req.cookies.token) {
    let decoded = jwt.verify(req.cookies.token, config.jwtSecret);
    User.get(decoded.id).then(user => {
      if (!user.cart.toString().includes(req.body._id)) {
        user.cart.push(req.body._id);
        user.save().then(error => {
          return res.json(user);
        })
      } else {
        return res.json(user)
      }
    })
  } else {
    throw Error('not login')
  }
}

function removeFromCart(req, res, next) {
  if (req.cookies.token) {
    let decoded = jwt.verify(req.cookies.token, config.jwtSecret);
    User.get(decoded.id).then(user => {
      console.log(user)
      console.log(1111)
      if (user.cart.toString().includes(req.body._id)) {
        user.cart = user.cart.filter(good_id => {
          return req.body._id !== good_id.toString()
        });
        user.save().then(error => {
          return res.json(user);
        })
      } else {
        return res.json(user)
      }
    })
  } else {
    throw Error('not login')
  }
}

function checkout(req, res, next) {
  User.getCart(getUserId(req)).then(user => {
    console.log(user);
    let money = 0;
    user.cart.forEach(good => {
      if (good.status == 0) {
        return;
      }
      money += good.price;
      good.status = 0;
      good.soldAt = Date.now();
      good.buyer = user._id;
      good.save(console.log)
      good.seller.money += good.price;
      good.seller.save(console.log)
    })
    user.money -= money;
    user.cart = [];
    user.save().then((e) => {
      console.log(e)
      res.json(user)
    }).catch(e => {next(e)})
  }).catch(e => next(e))
}

export default { load, get, create, update, list, remove, profile, addToCart , cart, removeFromCart, checkout };

let adminUser = new User({
  username: 'admin',
  password: 'admin',
  email: 'admin@admin.com',
  status: Number(1),
});


adminUser.save()
  .then(savedUser => console.log(savedUser))
  .catch(e => console.log(e));