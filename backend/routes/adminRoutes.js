const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, updateAdminProfile } = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/login', loginAdmin);
router.route('/admin/profile')
    .get(authenticate, getAdminProfile)
    .put(authenticate, updateAdminProfile);

module.exports = router;
