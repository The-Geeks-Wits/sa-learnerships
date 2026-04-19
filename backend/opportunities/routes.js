const express = require('express');
const opportunitiesController = require('./controller.js');
const { verifyToken } = require('../middlewares/auth.js');

const router = express.Router();

const createOpportunity = opportunitiesController.createOpportunity;
const getOpportunity = opportunitiesController.getOpportunity;
const getAllOpportunities = opportunitiesController.getAllOpportunities;
const getMyRejectedOpportunities = opportunitiesController.getMyRejectedOpportunities;
const editOpportunity = opportunitiesController.editOpportunity;

router.post('/', verifyToken, createOpportunity);
router.get('/', getAllOpportunities);
router.get('/rejected/mine', verifyToken, getMyRejectedOpportunities);
router.get('/:id', getOpportunity);
router.put('/:id', verifyToken, editOpportunity);

router.post('/:id/approve', opportunitiesController.approveOpportunity);
router.post('/:id/reject', opportunitiesController.rejectOpportunity);

module.exports = router;