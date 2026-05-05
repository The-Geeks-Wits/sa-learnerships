const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Title required! Please provide the title of the notification'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Message required! Please provide the message of the notification'],
        trim: true,
    },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Notification = model('Notification', notificationSchema);
module.exports = Notification;
