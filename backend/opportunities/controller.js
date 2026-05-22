const Opportunity = require('./Opportunity.js');
const mongoose = require('mongoose')
const { sendNotification } = require('../notifications/controller.js');

exports.createOpportunity = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'Opportunity details are missing! Please provide the required opportunity details',
            });
        }

        if (!req.user) {
            return res.status(400).json({
                error: 'Creator required! Please provide the creator of this opportunity',
            });
        }

        const title = req.body.title;
        const description = req.body.description;
        const requirements = req.body.requirements;
        const location = req.body.location;
        const closingDate = req.body.closingDate;
        const stipend = req.body.stipend;
        const duration = req.body.duration;
        const creator = req.user._id;
        const sector = req.body.sector;

        if (!title) {
            return res.status(400).json({
                error: 'Title required! Please provide the title of the opportunity',
            });
        }

        if (!closingDate) {
            return res.status(400).json({
                error: 'Closing date required! Please provide the closing date of the opportunity',
            });
        }

        // TODO: Check if stipend and duration are numbers, the location is a valid location, the closing date is a valid date,

        const opportunity = await Opportunity.create({
            title,
            creator,
            description,
            requirements,
            location,
            closingDate,
            stipend,
            duration,
            sector,
        });

        if (!opportunity) {
            return res.status(500).json({
                error: "Couldn't create opportunity! Please try again later",
            });
        }

        const notificationTitle = `Opportunity Submitted - ${opportunity.title}`;

        const message = `Your opportunity "${opportunity.title}" has been submitted successfully and is currently pending review.`;

        await sendNotification(opportunity.creator, notificationTitle, message);

        res.status(201).json({
            id: opportunity._id,
            creator: opportunity.creator,
            title: opportunity.title,
            description: opportunity.description,
            duration: opportunity.duration,
            requirements: opportunity.requirements,
            location: opportunity.location,
            closingDate: opportunity.closingDate,
            stipend: opportunity.stipend,
            status: opportunity.status,
            createdAt: opportunity.createdAt,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

exports.getMyOpportunities = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                error: 'Creator required! Please provide the creator of opportunities',
            });
        }

        const opportunities = await Opportunity.find({ creator: req.user._id });

        res.status(200).json({ opportunities });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
        console.log(error);
    }
};

exports.getAllOpportunities = async (req, res) => {
    try {
        if (!req.query || !req.query.status) {
            return res.status(400).json({
                error: 'Status required! Please provide the status of the opportunities',
            });
        }

        const opportunities = await Opportunity.find({ status: req.query.status });
        // No need to perform any checks because the above query always returns an array

        res.status(200).json({ opportunities });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

exports.getOpportunity = async (req, res) => {
    try {
        if (!req.params || !req.params.id) {
            return res.status(400).json({
                error: 'Opportunity id required! Please provide a valid opportunity id',
            });
        }

        // TODO: Catch the mongoose cast / invalid id exception
        const opportunity = await Opportunity.findById(req.params.id);

        if (!opportunity) {
            return res.status(400).json({
                error: 'Opportunity not found! Please check your id and try again',
            });
        }

        res.status(200).json({
            id: opportunity._id,
            title: opportunity.title,
            creator: opportunity.creator,
            requirements: opportunity.requirements,
            description: opportunity.description,
            duration: opportunity.duration,
            location: opportunity.location,
            closingDate: opportunity.closingDate,
            stipend: opportunity.stipend,
            status: opportunity.status,
            createdAt: opportunity.createdAt,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

exports.resubmitOpportunity = async (req, res) => {
    try {
        if (!req.params || !req.params.id) {
            return res.status(400).json({
                error: 'Opportunity id required! Please provide a valid opportunity id',
            });
        }

        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(400).json({
                error: 'Opportunity not found! Please check your id and try again',
            });
        }

        opportunity.status = 'Pending';
        await opportunity.save();

        const title = `Opportunity Update - ${opportunity.title}`;
        const message = `Your opportunity "${opportunity.title}" has been re-submitted successfully and is currently under review.`;
        await sendNotification(opportunity.creator,title,message);


        res.status(200).json({
            message: 'Opportunity re-submitted successfully!',
        });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

exports.rejectOpportunity = async (req, res) => {
    try {
        if (!req.params || !req.params.id) {
            return res.status(400).json({
                error: 'Opportunity id required! Please provide a valid opportunity id',
            });
        }

        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(400).json({
                error: 'Opportunity not found! Please check your id and try again',
            });
        }

        opportunity.status = 'Rejected';
        await opportunity.save();

        const title = `Opportunity Update - ${opportunity.title}`;
        const message = `After careful review, we regret to inform you that your opportunity "${opportunity.title}" was not approved at this time.`;
        await sendNotification(opportunity.creator,title,message);

        res.status(200).json({
            message: 'Opportunity rejected successfully!',
        });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

exports.approveOpportunity = async (req, res) => {
    try {
        if (!req.params || !req.params.id) {
            return res.status(400).json({
                error: 'Opportunity id required! Please provide a valid opportunity id',
            });
        }

        const opportunity = await Opportunity.findById(req.params.id);
        if (!opportunity) {
            return res.status(400).json({
                error: 'Opportunity not found! Please check your id and try again',
            });
        }

        opportunity.status = 'Approved';
        await opportunity.save();

        const title = `Opportunity Update - ${opportunity.title}`;
        const message = `We are pleased to inform you that your opportunity "${opportunity.title}" has been approved and is now visible to applicants.`;

        await sendNotification(opportunity.creator,title,message);

        res.status(200).json({
            message: 'Opportunity approved successfully!',
        });
    } catch (error) {
        res.status(500).json({
            error: 'Something went wrong! Please try again later',
        });
        console.log(error);
    }
};

// User Story 4: score and sort approved opportunities by how well they match the applicant's profile
exports.getMatchedOpportunities = async (req, res) => {
    try {
        const user = req.user;
 
        const opportunities = await Opportunity.find({ status: 'Approved' });
 
        const skillsDataset = req.app.locals.skills || {};
        const qualificationsDataset = req.app.locals.qualifications || [];
 
        // Build skill lookup from skills.json: lowercase skill name -> category
        const skillCategoryMap = new Map();
        for (const [category, skillList] of Object.entries(skillsDataset)) {
            skillList.forEach(skill => skillCategoryMap.set(skill.toLowerCase(), category));
        }
 
        const userSkills = (user.skills || []).map(s => s.toLowerCase().trim());
 
        // Get applicant's highest NQF level from qualifications.json
        const userNqfLevel = (user.qualifications || []).reduce((max, q) => {
            const match = qualificationsDataset.find(
                d => d.name.toLowerCase() === (q.qualificationName || '').toLowerCase().trim()
            );
            const level = match ? match.nqfLevel : (q.nqfLevel || 0);
            return Math.max(max, level);
        }, 0);
 
        const scoreOpportunity = (opp) => {
            const requirements = (opp.requirements || []).map(r => r.toLowerCase().trim());
            if (requirements.length === 0) return 0;
 
            let skillPoints = 0;
            let qualPoints = 0;
            const matchedCategories = new Set();
 
            for (const req of requirements) {
                // Skills match using skills.json
                const matchedSkill = userSkills.find(s => req.includes(s) || s.includes(req));
                if (matchedSkill) {
                    skillPoints += 1;
                    const category = skillCategoryMap.get(matchedSkill);
                    if (category) matchedCategories.add(category);
                }
 
                // Qualification match using qualifications.json
                const qualMatch = qualificationsDataset.find(q => {
                    const qName = q.qualificationLevel.toLowerCase();
                    return req.includes(qName) || req.includes(`nqf ${q.nqfLevel}`) || req.includes(`nqf level ${q.nqfLevel}`);
                });
                if (qualMatch && userNqfLevel >= qualMatch.nqfLevel) {
                    qualPoints += 1;
                }
            }
 
            // Bonus point if 2+ skills from the same category matched
            const categoryBonus = matchedCategories.size > 0 && skillPoints >= 2 ? 1 : 0;
 
            const totalPoints = skillPoints + qualPoints + categoryBonus;
            const maxPossible = requirements.length * 2;
            return Math.min(100, Math.round((totalPoints / maxPossible) * 100));
        };
 
        const scored = opportunities.map(opp => ({
            opportunity: opp,
            matchPercent: scoreOpportunity(opp),
        }));
 
        scored.sort((a, b) => b.matchPercent - a.matchPercent);
 
        const result = scored.map(({ opportunity, matchPercent }) => ({
            ...opportunity.toObject(),
            matchPercent,
        }));
 
        res.status(200).json({ opportunities: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
    }
};