const express = require('express');
const applicationsController = require('./controller.js');
const { isAuthenticated, isProvider } = require('../middlewares/auth.js');

const router = express.Router();

const submitApplication = applicationsController.submitApplication;
const getApplication = applicationsController.getApplication;
const getAllApplications = applicationsController.getAllApplications;
const getMyApplications = applicationsController.getMyApplications;
const getProviderApplications = applicationsController.getProviderApplications;
const getRejectedApplications = applicationsController.getRejectedApplications;
const rejectApplication = applicationsController.rejectApplication;

router.post('/', isAuthenticated, submitApplication);
router.get('/', isAuthenticated, getAllApplications);
router.get('/mine', isAuthenticated, getMyApplications);
router.get('/:id', isAuthenticated, getApplication);
router.get('/provider/all', isAuthenticated, isProvider, getProviderApplications);
router.patch('/:id/reject', isAuthenticated, isProvider, rejectApplication);
router.get('/provider/rejected', isAuthenticated, isProvider, getRejectedApplications);

module.exports = router;
