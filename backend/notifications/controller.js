const Notification = require('./Notification.js');

// This is a method to send all in-app notifications.
// It is not used as a middleware so there is no need to wrap it inside a try and catch block
// Infact all the errors that happen in this method should be handled by the middleware calling it
exports.sendNotification = async (recipient, title, message) => {
    if (!recipient || !title || !message) {
        throw new Error('All notification details are required');
    }

    const notification = await Notification.create({ recipient, title, message });

    if (!notification) {
        throw new Error('All notification details are required');
    }

    return notification;
};

exports.getMyNotifications = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({
                error: 'Recipient required! Please provide the recipient of the notifications',
            });
        }

        const notifications = await Notification.find({ recipient: req.user._id });

        res.status(200).json({ count: notifications.length, notifications });
    } catch {
        res.status(500).json({ message: 'Something went wrong! Please try again later' });
    }
};
exports.getNotificationById = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied' });
        }
        
        res.json({ notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateNotification = async (req, res) => {
    try {
        const { read } = req.body;
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { read },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        
        res.json({ notification });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};