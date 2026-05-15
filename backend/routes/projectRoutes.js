const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject, reorderProjects, updateStatus } = require('../controllers/projectController');
const { authenticate } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/reorder', authenticate, reorderProjects);

router.route('/')
    .get(getProjects)
    .post(authenticate, upload.single('image'), createProject);

router.route('/:id')
    .put(authenticate, upload.single('image'), updateProject)
    .delete(authenticate, deleteProject);

router.patch('/:id/status', authenticate, updateStatus);

module.exports = router;
