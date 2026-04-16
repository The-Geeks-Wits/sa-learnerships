const express = require('express');
const opportunitiesController = require('./controller.js');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.js');
const Opportunity = require('./Opportunity.js');
const router = express.Router();

const createOpportunity = opportunitiesController.createOpportunity;
const getOpportunity = opportunitiesController.getOpportunity;
const getAllOpportunities = opportunitiesController.getAllOpportunities;
const getMyOpportunities = opportunitiesController.getMyOpportunities;

router.post('/', isAuthenticated, createOpportunity);
router.get('/', getAllOpportunities);
router.get('/my_opportunities', isAuthenticated, getMyOpportunities);
router.get('/:id', getOpportunity);

router.post('/:id/approve',isAuthenticated ,isAdmin, opportunitiesController.approveOpportunity);
router.post('/:id/reject', isAuthenticated ,isAdmin, opportunitiesController.rejectOpportunity);

router.post('/fix-all-creators', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        
        // Get all opportunities
        const allOpportunities = await Opportunity.find({});
        
        let updatedCount = 0;
        
        // Update each opportunity individually
        for (const opp of allOpportunities) {
            opp.creator = userId;
            await opp.save();
            updatedCount++;
        }
        
        res.json({
            message: `Updated ${updatedCount} opportunities`,
            totalOpportunities: allOpportunities.length,
            userId: userId
        });
    } catch (error) {
        console.error('Fix error:', error);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});
module.exports = router;
