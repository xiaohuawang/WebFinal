import express from 'express';
import validate from 'express-validation';
import paramValidation from '../config/param-validation';
import goodCtrl from '../controllers/goods.controller';

const router = express.Router();

router.route('/')
  /** GET /api/users - Get list of users */
  .get(goodCtrl.list)

  /** POST /api/users - Create new user */
  .post(goodCtrl.create);

router.route('/profile').get(goodCtrl.profile)

router.route('/:goodId')
  /** GET /api/users/:userId - Get user */
  .get(goodCtrl.superget)

  /** PUT /api/users/:userId - Update user */
  .put(goodCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(goodCtrl.remove);

router.param('goodId', goodCtrl.load);

export default router;
