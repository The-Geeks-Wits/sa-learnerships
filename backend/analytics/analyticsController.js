const Application = require('../applications/Applications.js');
const User = require('../authorization/User.js');
const Opportunity = require('../opportunities/Opportunity.js');
const mongoose = require('mongoose');
const path = require('path');

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

exports.getPlacementSuccessReport = async (req, res) => {
    try {
        const { sectors, dateFrom, dateTo } = req.body;

        if (!sectors || !Array.isArray(sectors) || sectors.length === 0) {
            return res.status(400).json({ error: 'Please provide at least one sector.' });
        }

        const pipeline = [];

        // Match opportunities by sector and date
        const match = {};
        if (sectors) {
            match.sector = { $in: sectors };
        }
        if (dateFrom || dateTo) {
            match.createdAt = {};
            if (dateFrom) match.createdAt.$gte = new Date(dateFrom);
            if (dateTo) match.createdAt.$lte = new Date(dateTo);
        }
        if (Object.keys(match).length > 0) {
            pipeline.push({ $match: match });
        }

        // Look up applications for each opportunity
        pipeline.push({
            $lookup: {
                from: 'applications',
                localField: '_id',
                foreignField: 'opportunity',
                as: 'applicationData'
            }
        });

        // Group by sector
        pipeline.push({
            $group: {
                _id: { sector: '$sector' },
                totalOpportunities: { $sum: 1 },
                totalApplications: { $sum: { $size: '$applicationData' } },
                successfulApplications: {
                    $sum: {
                        $size: {
                            $filter: {
                                input: '$applicationData',
                                as: 'app',
                                cond: { $in: ['$$app.status', ['Shortlisted', 'Accepted', 'Approved']] }
                            }
                        }
                    }
                },
                unsuccessfulApplications: {
                    $sum: {
                        $size: {
                            $filter: {
                                input: '$applicationData',
                                as: 'app',
                                cond: { $eq: ['$$app.status', 'Rejected'] }
                            }
                        }
                    }
                },
                ongoingApplications: {
                    $sum: {
                        $size: {
                            $filter: {
                                input: '$applicationData',
                                as: 'app',
                                cond: { $eq: ['$$app.status', 'Pending'] }
                            }
                        }
                    }
                }
            }
        });

        // Project the final output
        pipeline.push({
            $project: {
                sector: '$_id.sector',
                totalOpportunities: 1,
                totalApplications: 1,
                successfulApplications: 1,
                unsuccessfulApplications: 1,
                ongoingApplications: 1,
                placementSuccessRate: {
                    $cond: [
                        { $eq: ['$totalApplications', 0] },
                        0,
                        { $multiply: [{ $divide: ['$successfulApplications', '$totalApplications'] }, 100] }
                    ]
                }
            }
        });

        pipeline.push({ $sort: { placementSuccessRate: -1 } });

        const results = await Opportunity.aggregate(pipeline);

        return res.json({ success: true, data: results });
    } catch (err) {
        console.error('Placement success report error:', err);
        return res.status(500).json({ error: 'Failed to generate placement success report.' });
    }
};
exports.exportPlacementReport = async (req, res) => {
    try {
        const { headers, rows, format } = req.body;
        
        if (format === 'csv') {
            let csv = headers.join(',') + '\n';
            rows.forEach(row => {
                csv += row.join(',') + '\n';
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=placement_report_${Date.now()}.csv`);
            return res.send(csv);
        } 
        else if (format === 'pdf') {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument();
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=placement_report_${Date.now()}.pdf`);
            
            doc.pipe(res);
            
            doc.fontSize(16).text('Placement Success Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(10).text(`Generated: ${new Date().toLocaleString()}`, { align: 'right' });
            doc.moveDown();
            
            let y = 150;
            doc.fontSize(10);
            headers.forEach((header, index) => {
                doc.text(header, 50 + (index * 100), y);
            });
            
            y += 20;
            rows.forEach(row => {
                row.forEach((cell, index) => {
                    doc.text(String(cell), 50 + (index * 100), y);
                });
                y += 20;
                
                if (y > 700) {
                    doc.addPage();
                    y = 50;
                }
            });
            
            doc.end();
        } 
        else {
            return res.status(400).json({ error: 'Format must be either "csv" or "pdf"' });
        }
    } catch (err) {
        console.error('Export placement report error:', err);
        return res.status(500).json({ error: 'Failed to export placement report.' });
    }
};
exports.getApplicationVolume = async (req,res) => {
    try{
        let applications;
        let user = req.user;

        if (user.role === 'admin'){
            applications = await Application.find().populate('opportunity');
        }

        else if (user.role === 'provider'){
            const opportunities = await Opportunity.find({creator : user._id});
            const opportunityIds = opportunities.map((opportunity) => {
                return opportunity._id;
            })
            applications = await Application.find({
                opportunity: { $in: opportunityIds}
            }).populate('opportunity');
        }
        else{
            return res.status(403).json({
                error: 'Access denied'
            });
        }

        const applicationVolume = {};
        for (let i = 0; i < applications.length; i++){
            const application = applications[i];
            if (!application.opportunity){
                continue;
            }
            const title = application.opportunity.title;

            if (!applicationVolume[title]){
                applicationVolume[title] = {
                    opportunityTitle : title,
                    totalApplications: 0
                };
            }
            applicationVolume[title].totalApplications++;
           
        }
         const results = Object.values(applicationVolume);

        return res.status(200).json({
            success: true,
            data: results
        });
    }catch(err){
        console.error('Application volume error:',err)
        return res.status(500).json({
            error : 'Failed to load application volume report'
        });
    }

}
