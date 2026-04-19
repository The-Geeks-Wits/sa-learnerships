const express = require('express');
const applicationsController = require('./controller.js');
const { verifyTokenCookie } = require('../middlewares/auth.js');

const router = express.Router();

const submitApplication = applicationsController.submitApplication;
const getApplicationsForOpportunity = applicationsController.getApplicationsForOpportunity;

router.post('/:id/apply', verifyTokenCookie, submitApplication);
router.get('/:id/applications', verifyTokenCookie, getApplicationsForOpportunity);

module.exports = router;