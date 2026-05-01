const express = require('express');
const applicationsController = require('./controller.js');
const { isAuthenticated } = require('../middlewares/auth.js');

const router = express.Router();

const submitApplication = applicationsController.submitApplication;
const getApplication = applicationsController.getApplication;

router.post('/', isAuthenticated, submitApplication);
router.get('/:id', isAuthenticated, getApplication);

module.exports = router;
