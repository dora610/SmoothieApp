const router = require('express').Router();
const smoothieController = require('../controllers/smoothieController');
const { requireAuth, chechUser } = require('../middlewares/authMiddleware');

router.get('/', requireAuth, smoothieController.showSmoothies);
router.get('/add', smoothieController.addSmoothie);
router.post('/add', smoothieController.createSmoothie);

module.exports = router;
