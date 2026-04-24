const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/login', ctrl.adminLogin);
router.get('/dashboard', admin, ctrl.getDashboard);
router.get('/users', admin, ctrl.getAllUsers);
router.get('/orders', admin, ctrl.getAllOrders);
router.get('/orders/:orderId', admin, ctrl.getOrderById);
router.put('/orders/:orderId/status', admin, ctrl.updateOrderStatus);
router.post('/products', admin, upload.array('images', 10), ctrl.addProduct);
router.put('/products/:productId', admin, upload.array('images', 10), ctrl.updateProduct);
router.delete('/products/:productId', admin, ctrl.deleteProduct);
router.post('/categories', admin, upload.single('image'), ctrl.addCategory);
router.put('/categories/:categoryId', admin, upload.single('image'), ctrl.updateCategory);

module.exports = router;