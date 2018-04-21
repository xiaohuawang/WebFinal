import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import postRoutes from './post.route';
import goodRoutes from './goods.route'

const router = express.Router();
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/users', userRoutes);

router.use('/auth', authRoutes);

router.use('/posts', postRoutes);

router.use('/goods', goodRoutes)
export default router;
