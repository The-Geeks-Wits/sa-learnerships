const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const applicationSchema = new Schema({
    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    opportunity: {
        type: Schema.Types.ObjectId,
        ref: 'Opportunity',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Shortlisted', 'Rejected'],
        default: 'Pending',
    },
    createdAt: { type: Date, default: Date.now },
});

const Application = model('Application', applicationSchema);
module.exports = Application;
