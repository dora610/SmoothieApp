const router = require('express').Router();
const smoothieController = require('../controllers/smoothieController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', smoothieController.showHomepage);

router.get('/smoothies', smoothieController.showSmoothies);

router
  .route('/smoothies/add')
  .get(requireAuth, smoothieController.addSmoothie)
  .post(requireAuth, smoothieController.createSmoothie);

router
  .route('/smoothies/edit/:id')
  .get(requireAuth, smoothieController.editSmoothiePage)
  .put(requireAuth, smoothieController.updateSmoothie);

router
  .route('/smoothies/:id')
  .get(requireAuth, smoothieController.viewSmoothie);

module.exports = router;
