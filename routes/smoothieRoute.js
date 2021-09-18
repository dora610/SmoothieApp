const router = require('express').Router();
const smoothieController = require('../controllers/smoothieController');
const { requireAuth } = require('../middlewares/authMiddleware');

router.get('/', requireAuth, smoothieController.showSmoothies);
router.get('/add', requireAuth, smoothieController.addSmoothie);
router.post('/add', requireAuth, smoothieController.createSmoothie);

module.exports = router;
