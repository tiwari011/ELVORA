const router = require('express').Router();
const ctrl = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, ctrl.addReview);
router.get('/product/:productId', ctrl.getProductReviews);
router.put('/:reviewId', auth, ctrl.updateReview);
router.delete('/:reviewId', auth, ctrl.deleteReview);

module.exports = router;