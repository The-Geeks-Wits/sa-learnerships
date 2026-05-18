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
const getMatchedOpportunities = opportunitiesController.getMatchedOpportunities;

router.get('/mine', isAuthenticated, isProvider, getMyOpportunities);
router.get('/matched', isAuthenticated, getMatchedOpportunities);
router.get('/', getAllOpportunities);
router.post('/', isAuthenticated, isProvider, createOpportunity);

router.post('/:id/approve', isAuthenticated, isAdmin, approveOpportunity);
router.post('/:id/reject', isAuthenticated, isAdmin, rejectOpportunity);
router.post('/:id/resubmit', isAuthenticated, isProvider, resubmitOpportunity);

router.get('/:id', getOpportunity);

module.exports = router;