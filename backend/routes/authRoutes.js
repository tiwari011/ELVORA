const router = require('express').Router();
const ctrl = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/register', ctrl.register);
router.post('/login', ctrl.login);
router.get('/profile', auth, ctrl.getProfile);
router.put('/profile', auth, ctrl.updateProfile);

router.post('/address', auth, ctrl.addAddress);
router.put('/address/:addressId', auth, ctrl.updateAddress);
router.delete('/address/:addressId', auth, ctrl.deleteAddress);
router.put('/address/:addressId/default', auth, ctrl.setDefaultAddress);
module.exports = router;