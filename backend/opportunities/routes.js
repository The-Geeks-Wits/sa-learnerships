const express = require('express');
const opportunitiesController = require('./controller.js');

const router = express.Router();

const createOpportunity = opportunitiesController.createOpportunity;
const getOpportunity = opportunitiesController.getOpportunity;
const getAllOpportunities = opportunitiesController.getAllOpportunities;

router.post('/', createOpportunity);
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunity);

router.post('/:id/approve',isAuthenticated ,isAdmin, opportunitiesController.approveOpportunity);
router.post('/:id/reject', isAuthenticated ,isAdmin, opportunitiesController.rejectOpportunity);

module.exports = router;
