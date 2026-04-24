const router = require('express').Router();
const ctrl = require('../controllers/productController');

router.get('/', ctrl.getProducts);
router.get('/category/:categorySlug', ctrl.getProductsByCategory);
router.get('/by-id/:id', ctrl.getProductById);
router.get('/:slug', ctrl.getProductBySlug);

module.exports = router;