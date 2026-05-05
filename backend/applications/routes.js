const express = require('express');
const applicationsController = require('./controller.js');
const { isAuthenticated } = require('../middlewares/auth.js');

const router = express.Router();

const submitApplication = applicationsController.submitApplication;
const getApplication = applicationsController.getApplication;
const getAllApplications = applicationsController.getAllApplications;
const getMyApplications = applicationsController.getMyApplications;

router.post('/', isAuthenticated, submitApplication);
router.get('/', isAuthenticated, getAllApplications);
router.get('/mine', isAuthenticated, getMyApplications);
router.get('/:id', isAuthenticated, getApplication);

module.exports = router;
