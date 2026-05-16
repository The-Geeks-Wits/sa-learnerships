const Application = require('../applications/Applications.js');   // adjust path if needed
const User = require('../authorization/User.js');                // adjust path if needed
const mongoose = require('mongoose');

exports.getCustomReport = async (req, res) => {
    try {
        const { dimensions, metric, filters } = req.body;

        // Validate input
        if (!dimensions || !Array.isArray(dimensions) || dimensions.length === 0) {
            return res.status(400).json({ error: 'Please provide at least one dimension.' });
        }
        if (!metric) {
            return res.status(400).json({ error: 'Please provide a metric.' });
        }

        const pipeline = [];

        //filters: opportunity, status, dateFrom, dateTo
        const match = {};
        if (filters) {
            if (filters.opportunity) match.opportunity = new mongoose.Types.ObjectId(filters.opportunity);
            if (filters.status) match.status = filters.status;
            if (filters.dateFrom || filters.dateTo) {
                match.createdAt = {};
                if (filters.dateFrom) match.createdAt.$gte = new Date(filters.dateFrom);
                if (filters.dateTo) match.createdAt.$lte = new Date(filters.dateTo);
            }
        }
        if (Object.keys(match).length > 0) {
            pipeline.push({ $match: match });
        }

        //Joining with our User collection to get applicant details (for dimensions like location, nqfLevel)
        pipeline.push({
            $lookup: {
                from: 'users',
                localField: 'applicant',
                foreignField: '_id',
                as: 'applicantData'
            }
        });
        pipeline.push({ $unwind: '$applicantData' });

        //keys for grouping by dimensions
        const groupId = {};

        if (dimensions.includes('location')) {
            groupId.location = '$applicantData.location';
        }

        // For nqfLevel, we need to find the highest qualification level of the applicant
        if (dimensions.includes('nqfLevel')) {
            pipeline.push({
                $addFields: {
                    maxNqf: {
                        $max: {
                            $map: {
                                input: '$applicantData.qualifications',
                                as: 'qual',
                                in: '$$qual.nqfLevel'
                            }
                        }
                    }
                }
            });
            groupId.nqfLevel = '$maxNqf';
        }

        //groping for metrics (shortlistRate, totalApplications)
        pipeline.push({
            $group: {
                _id: groupId,
                totalApplications: { $sum: 1 },
                shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'Shortlisted'] }, 1, 0] } },
                rejected: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } },
                pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } }
            }
        });

        //final formatting of the output
        pipeline.push({
            $project: {
                location: '$_id.location',
                nqfLevel: '$_id.nqfLevel',
                totalApplications: 1,
                shortlisted: 1,
                rejected: 1,
                pending: 1,
                shortlistRate: {
                    $cond: [
                        { $eq: ['$totalApplications', 0] },
                        0,
                        { $multiply: [{ $divide: ['$shortlisted', '$totalApplications'] }, 100] }
                    ]
                }
            }
        });

        //sorting in desc order of total applications (most popular first)
        pipeline.push({ $sort: { totalApplications: -1 } });

        //command to execute the aggregation pipeline
        const results = await Application.aggregate(pipeline);

        return res.json({ success: true, data: results });
    } catch (err) {
        console.error('Analytics custom report error:', err);
        return res.status(500).json({ error: 'Failed to generate custom report.' });
    }
};