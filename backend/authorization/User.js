const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;


const userSchema = new Schema({
    
    firstName: {type:String, required:true, trim:true},
    lastName: {type:String, required:true, trim:true},
    email: {type:String, required:true, unique:true, lowercase:true, trim:true},
    password: { 
        type: String, 
        required: function() {
            return !this.googleId; 
        }
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
    googleId : {type: String},
    signupMethod: {type: String},
    createdAt: {type:Date, default: Date.now}
});

const User = model('User', userSchema);
module.exports = User;
