const express = require('express');
const applicationsController = require('./controller.js');
const { isAuthenticated } = require('../middlewares/auth.js');

const router = express.Router();

const submitApplication = applicationsController.submitApplication;
const getApplicationsForOpportunity = applicationsController.getApplicationsForOpportunity;

router.post('/apply/:id', isAuthenticated, submitApplication); // The ID here is the id of the opportunity we wish to apply to
router.get('/:id/applications', isAuthenticated, getApplicationsForOpportunity);

module.exports = router;
