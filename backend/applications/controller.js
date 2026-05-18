const Application = require('./Applications.js');
const Opportunity = require('../opportunities/Opportunity.js');
const { sendNotification } = require('../notifications/controller.js');

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

        const title = `Application Received - Thank You ${req.user.firstName}`;
        const message = `We're pleased to confirm the receipt of your application for the ${opportunity.title} opportunity.`;
        sendNotification(req.user._id, title, message);

        res.status(201).json({
            id: application._id,
            applicant: application.applicant,
            opportunity: application.opportunity,
            status: application.status,
            createdAt: application.createdAt,
        });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
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
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
        console.log(error);
    }
};

exports.getMyApplications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                error: 'User not found! Please log in to continue',
            });
        }

        const queryOptions = { applicant: req.user._id };
        if (req.query && req.query.status) {
            queryOptions.status = req.query.status;
        }

        const applications = await Application.find(queryOptions);

        // Populate opportunity details instead of returning ids to the user
        for (let i = 0; i < applications.length; i++) {
            const application = applications[i].toObject();
            const details = await Opportunity.findById(application.opportunity);
            const detailsObj = details.toObject();
            applications[i] = { ...application, opportunity: detailsObj };
        }

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
        console.log(error);
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                error: 'Creator required! Please provide the creator of opportunities',
            });
        }

        const opportunities = await Opportunity.find({ creator: req.user._id });

        const applications = [];
        for (let i = 0; i < opportunities.length; i++) {
            const opportunity = opportunities[i].toObject();
            const queryOptions = { opportunity: opportunity._id };

            if (req.query && req.query.status) {
                queryOptions.status = req.query.status;
            }

        const opportunityApplications = await Application.find(queryOptions);

            for (let i = 0; i < opportunityApplications.length; i++) {
                const application = opportunityApplications[i].toObject();
                opportunityApplications[i] = { ...application, opportunity: opportunity };
            }

            applications.push(...opportunityApplications);
        }

        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
        console.log(error);
    }
};
exports.rejectApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;

        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const application = await Application.findById(applicationId).populate('opportunity');
        
        if (!application) {
            return res.status(404).json({ error: 'Application not found' });
        }

        if (application.opportunity.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                error: 'You can only reject applications for your own opportunities' 
            });
        }

        if (application.status !== 'Pending') {
            return res.status(400).json({ 
                error: `This application has already been ${application.status.toLowerCase()}` 
            });
        }

        application.status = 'Rejected';
        await application.save();

        try {
           
            const title = `Application Update - ${application.opportunity.title}`;
            const message = `After careful consideration, we regret to inform you that your application for the ${application.opportunity.title} opportunity was not successful at this time.`;
            await sendNotification(application.applicant, title, message);
        } catch (notifError) {
            console.log('Notification error (non-critical):', notifError.message);
        }
        
        res.status(200).json({
            success: true,
            message: 'Application rejected successfully',
            application: {
                id: application._id,
                status: application.status,
                opportunity: application.opportunity.title
            }
        });
    } catch (error) {
        console.error('Reject application error:', error);
        res.status(500).json({ 
            error: 'Something went wrong! Please try again later',
            details: error.message 
        });
    }
};

exports.shortlistApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;

        if (!req.user) {
            return res.status(401).json({
                error: 'You are not logged in! Please log in to continue',
            });
        }

        const userId = req.user._id;

        const application = await Application.findById(applicationId).populate('opportunity');

        if (!application) {
            return res.status(404).json({
                error: 'Application not found',
            });
        }

        if (application.opportunity.creator.toString() !== userId.toString()) {
            return res.status(403).json({
                error: 'You can only shortlist applications for your own opportunities',
            });
        }

        application.status = 'Shortlisted';
        await application.save();

        const title = `Application Update - ${application.opportunity.title}`;
        const message = `After careful consideration, we are pleased to inform you that your application for the ${application.opportunity.title} opportunity has been shortlisted.`;

        await sendNotification(application.applicant, title, message);

        res.status(200).json({
            message: 'Application shortlisted successfully',
            application,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
    }
};

exports.getApplicationDetails = async (req,res) =>{
    try{
        if (!req.user){
            return res.status(401).json({
                error: 'You are not logged in! Please log in to continue',
            });
        }

        const applicationId = req.params.id;
        const application = await Application.findById(applicationId);

        if (!application){
            return res.status(404).json({
                error : "Application not found"
            });
        }

        const opportunity = await Opportunity.findById(application.opportunity);

        const isApplicant = (application.applicant.toString() === req.user._id.toString());
        const isProvider = (opportunity.creator.toString() == req.user._id.toString());
        
        if (!isApplicant && !isProvider){
            return res.status(403).json({
                error: 'Unauthorized'
            });
        }

        const detailedApplication = await Application.findById(applicationId).populate('applicant').populate({
            path: 'opportunity',
            populate:{
                path: 'creator',
                select: 'firstName lastName'
            }
        });

        res.status(200).json({detailedApplication});

    
    }catch{
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
    }
}
