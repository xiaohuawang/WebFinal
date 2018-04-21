import express from 'express';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import userCtrl from '../controllers/user.controller';

const router = express.Router();

router.route('/')
  .get(userCtrl.list)

  /** POST /api/users - Create new user */
  .post(validate(paramValidation.createUser), userCtrl.create);

router.route('/profile').get(userCtrl.profile)
router.route('/cart').get(userCtrl.cart)
router.route("/addToCart")
  .patch(userCtrl.addToCart)
router.route("/removeFromCart").patch(userCtrl.removeFromCart)
router.route("/checkout").patch(userCtrl.checkout)
router.route('/:userId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);


/** Load user when API with userId route parameter is hit */
router.param('userId', userCtrl.load);

export default router;
