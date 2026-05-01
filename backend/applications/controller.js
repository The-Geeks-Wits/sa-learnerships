const Application = require('./Applications.js');
const Opportunity = require('../opportunities/Opportunity.js');

exports.submitApplication = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                error: 'You are not logged in! Please log in to continue',
            });
        }

        if (!req.body || !req.body.opportunityId) {
            return res.status(400).json({
                error: 'Opportunity id required! Please provide a valid opportunity id',
            });
        }

        const opportunityId = req.body.opportunityId;
        const applicantId = req.user._id;

        const opportunity = await Opportunity.findById(opportunityId);

        if (!opportunity) {
            return res.status(400).json({
                error: 'Opportunity not found! Please check your id and try again',
            });
        }

        const existingApplication = await Application.findOne({
            applicant: applicantId,
            opportunity: opportunityId,
        });

        if (existingApplication) {
            return res.status(400).json({
                error: 'You have already applied for this opportunity',
            });
        }

        const application = await Application.create({
            applicant: applicantId,
            opportunity: opportunityId,
        });

        res.status(201).json({
            id: application._id,
            applicant: application.applicant,
            opportunity: application.opportunity,
            status: application.status,
            createdAt: application.createdAt,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

exports.getApplication = async (req, res) => {
    try {
        const opportunityId = req.params.id;

        if (!opportunityId) {
            return res.status(400).json({
                error: 'Opportunity id required! Please provide a valid opportunity id',
            });
        }

        const applications = await Application.find({ opportunity: opportunityId }).populate(
            'applicant',
            'firstName lastName email',
        );

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};
