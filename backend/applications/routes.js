const express = require('express');
const applicationsController = require('./controller.js');
const { isAuthenticated, isProvider } = require('../middlewares/auth.js');

const router = express.Router();

const submitApplication = applicationsController.submitApplication;
const getApplication = applicationsController.getApplication;
const getAllApplications = applicationsController.getAllApplications;
const getMyApplications = applicationsController.getMyApplications;
const getApplicationDetails = applicationsController.getApplicationDetails;
const shortlistApplication = applicationsController.shortlistApplication;
const getProviderApplications = applicationsController.getProviderApplications;
const getRejectedApplications = applicationsController.getRejectedApplications;
const rejectApplication = applicationsController.rejectApplication;

router.post('/', isAuthenticated, submitApplication);
router.get('/mine', isAuthenticated, getMyApplications);
router.get('/details/:id', isAuthenticated, getApplicationDetails);
router.patch('/:id/shortlist', isAuthenticated, shortlistApplication);
router.get('/:id', isAuthenticated, getApplication);
router.get('/', isAuthenticated, getAllApplications);
router.get('/provider/all', isAuthenticated, isProvider, getProviderApplications);
router.get('/provider/rejected', isAuthenticated, isProvider, getRejectedApplications);
router.patch('/:id/reject', isAuthenticated, isProvider, rejectApplication);
router.get('/:id', isAuthenticated, getApplication);  // ← moved to bottom

module.exports = router;
