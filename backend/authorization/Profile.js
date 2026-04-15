const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;


const profileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required : true,
        unique: true
    },
    Gender : {String, enum:["Male","Female","Prefer Not To Say"]},
    dateOfBirth : Date,
    phone : String,
    location: String,
    qualification: String,
    nqfLevel : Number,
    institution: String,
    skills : [String],
    editedAt: {type:Date, default: Date.now}
})

const Profile = model('Profile', profileSchema);