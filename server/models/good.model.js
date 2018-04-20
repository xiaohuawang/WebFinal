import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import UserSchema from './user.model'

/**
 * User Schema
 * 
 */
const FETCH_TYPE = {
    "BOUGHT": 0,
    "SELL": 1,
    "ALL_ON_SALE": 2
}
const Schema = mongoose.Schema;
const SOLD = 0
const ON_SALE = 1
const GoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: { unique: true }
    },
    seller: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    soldAt: {
        type: Date,
        required: false
    },
    status: {
        type: Number,
        default: ON_SALE
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    }, 
    imgSrc: {
        type: String,
        default: ''
    }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
GoodSchema.method({
});

/**
 * Statics
 */
GoodSchema.statics = {
    /*
     * Get user
     * @param {ObjectId} id - The objectId of user.
     * @returns {Promise<User, APIError>}
     */
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

    findByName: function (name) {
        return this.find({ "name": name }).exec()
    },

    superget(id) {
        return this.findById(id).populate('seller').populate('buyer')
        .exec()
        .then((user) => {
            if (user) {
                return user;
            }
            const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
            return Promise.reject(err);
        });
    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - Limit number of users to be returned.
     * @returns {Promise<User[]>}
     */

    list({ user_id = undefined, limit = 50, type } = {}) {
        type = Number(type);
        switch (type) {
            case FETCH_TYPE.BOUGHT:
                return this.find({buyer: user_id}).sort({soldAt: -1}).populate('seller').populate('buyer').exec()
            case FETCH_TYPE.ALL_ON_SALE:
                return this.find({status: ON_SALE}).sort({createdAt: -1}).populate('seller').populate('buyer').exec()
            case FETCH_TYPE.SELL:
                return this.find({seller: user_id}).sort({createdAt: -1}).populate('seller').populate('buyer').exec()
            default:
                return this.find().populate('seller').populate('buyer')
                    .sort({ createdAt: -1 })
                    .limit(+limit)
                    .exec();
        }
   }
};

/**
 * @typedef User
 */
export default mongoose.model('Good', GoodSchema);
