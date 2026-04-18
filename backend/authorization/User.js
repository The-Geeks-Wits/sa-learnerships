const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema({
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
    // roles: {type: [String], default: ['Applicant']},...this one will not align with modifying a user role
    role: {
      type: String,
      enum: ["applicant", "provider", "admin"],
      default: "applicant"
    },
//i will use this for softdelete  later
    status: {
      type: String,
      enum: ["active", "inactive", "disabled"],
      default: "active"
},
     //this is a dulicate fix it
  
    signupMethod: {type: String},
    //Im commenting out this created at because it duplicates with timestamps true,
    //and it may cause an error when creating a user...timestamp is more convinient to use for createdAt and updatedAt.
    //createdAt: {type:Date, default: Date.now},

    //profile data
    gender: {
    type: String,
    enum: ["Male", "Female", "Prefer Not To Say"]
    },
    dateOfBirth : Date,
    phone : {type:String, default:null},
    location: {type:String, default:null},

    cv: {
  type: String, //will store file path to the uploaded CV
  default: null
},

    qualifications : [
        {
            qualificationLevel: {type : String},
            qualificationName : {type : String},
            nqfLevel : {type: Number},
            institution : {type: String}
        }
    ],
    skills : {type: [String], default: []},
}, {timestamps: true});
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
    //this is a dulicate fix it
    googleId: { type: String },
    signupMethod: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const User = model('User', userSchema);
module.exports = User;
