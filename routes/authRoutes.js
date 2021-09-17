const router = require('express').Router();
const authController = require('../controllers/authController');

router
  .route('/signup')
  .get(authController.signup_get)
  .post(authController.signup_post);

router
  .route('/login')
  .get(authController.login_get)
  .post(authController.login_post);

router.get('/logout', authController.logout_get);

// TODO: create reset password flow

module.exports = router;
