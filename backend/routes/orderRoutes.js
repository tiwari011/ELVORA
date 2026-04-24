const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.post('/create', auth, ctrl.createCODOrder);
router.post('/razorpay/create', auth, ctrl.createRazorpayOrder);
router.post('/razorpay/verify', auth, ctrl.verifyRazorpayPayment);
router.get('/my-orders', auth, ctrl.getMyOrders);
router.get('/:orderId', auth, ctrl.getOrderById);

module.exports = router;