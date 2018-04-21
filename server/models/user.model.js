import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * User Schema
 * 
 */

const CUSTOMER = 3
const SELLER = 2
const SUPER_USER = 1
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: { unique: true }
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: CUSTOMER
  },
  description: {
    type: String,
    default: ''
  },
  cart: [{
    type: Schema.Types.ObjectId,
    default: [],
    ref: "Good"
  }],
  money: {
    type: Number,
    default: 1000
  }
});

UserSchema.method({
});


UserSchema.statics = {

  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getCart(id) {
    return this.findById(id).populate({
      path: "cart",
      populate: [{path: 'buyer'}, {path: 'seller'}]
    })
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  findByName: function (name) {
    return this.find({ "username": name }).exec()
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('User', UserSchema);
