const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
        },
        googleId: { type: String, sparse: true },

        role: {
            type: String,
            enum: ['applicant', 'provider', 'admin'],
            default: 'applicant',
        },

        //i will use this for softdelete  later
        status: {
            type: String,
            enum: ['active', 'inactive', 'disabled'],
            default: 'active',
        },

        signupMethod: { type: String },

        //profile data
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Prefer Not To Say'],
        },

        dateOfBirth: Date,

        phone: { type: String, default: null },

        location: { type: String, default: null },

        cv: {
            type: String, //will store file path to the uploaded CV
            default: null,
        },

        qualifications: [
    {
        qualificationName: { type: String },
        qualificationLevel: { type: String },   
        nqfLevel: { type: Number },            
        institution: { type: String },
    },
],

        skills: { type: [String], default: [] },
    },
    { timestamps: true },
);

const User = model('User', userSchema);
module.exports = User;
