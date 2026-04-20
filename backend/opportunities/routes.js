const express = require('express');
const opportunitiesController = require('./controller.js');
const { isAuthenticated, isProvider, isAdmin } = require('../middlewares/auth.js');

const router = express.Router();

const createOpportunity = opportunitiesController.createOpportunity;
const approveOpportunity = opportunitiesController.approveOpportunity;
const rejectOpportunity = opportunitiesController.rejectOpportunity;
const getOpportunity = opportunitiesController.getOpportunity;
const getAllOpportunities = opportunitiesController.getAllOpportunities;
const getMyOpportunities = opportunitiesController.getMyOpportunities;
const resubmitOpportunity = opportunitiesController.resubmitOpportunity;

router.post('/', isAuthenticated, isProvider, createOpportunity);
router.get('/mine', isAuthenticated, isProvider, getMyOpportunities);
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunity);

router.post('/:id/approve', isAuthenticated, isAdmin, approveOpportunity);
router.post('/:id/reject', isAuthenticated, isAdmin, rejectOpportunity);
router.post('/:id/resubmit', isAuthenticated, isProvider, resubmitOpportunity);

module.exports = router;
