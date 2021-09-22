const router = require('express').Router();
const smoothieController = require('../controllers/smoothieController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', smoothieController.showSmoothies);

router
  .route('/add')
  .get(requireAuth, smoothieController.addSmoothie)
  .post(requireAuth, smoothieController.createSmoothie);

router.route('/edit/:id').get(requireAuth, smoothieController.editSmoothiePage);
router.route('/edit/:id').post(requireAuth, smoothieController.updateSmoothie);

module.exports = router;
