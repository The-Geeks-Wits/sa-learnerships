const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

// The creator attribute should be a mongoose User _id
const opportunitySchema = new Schema({
    creator: {
        type: String,
        required: [true, 'Creatore required! Please provide the creator of the opportunities'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'Title required! Please provide the title of the opportunity'],
        trim: true,
    },
    requirements: { type: [String], required: [true, 'Atleast one requirement is required'] },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    closingDate: {
        type: Date,
        required: [true, 'Closing date required! Please provide the closing date of the opportunity'],
    },
    stipend: { type: Number, min: 0 },
    duration: { type: Number, min: 0 },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
});

const Opportunity = model('Opportunity', opportunitySchema);
module.exports = Opportunity;
