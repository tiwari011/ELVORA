const router = require('express').Router();
const ctrl = require('../controllers/cartController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, ctrl.getCart);
router.post('/', auth, ctrl.addToCart);
router.put('/:itemId', auth, ctrl.updateCartItem);
router.delete('/:itemId', auth, ctrl.removeFromCart);
router.delete('/', auth, ctrl.clearCart);

module.exports = router;