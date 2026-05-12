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

        const unreadNotifications = notifications.filter((notification) => !notification.read);
        const unreadCount = unreadNotifications.length;

        res.status(200).json({ count: unreadCount, notifications });
    } catch {
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
    }
};

exports.getNotification = async (req, res) => {
    try {
        if (!req.params || !req.params.id) {
            return res.status(400).json({
                error: 'Notification id required! Please provide a valid notification id',
            });
        }

        if (!req.user) {
            return res.status(400).json({
                error: 'Recipient required! Please provide the recipient of the notifications',
            });
        }

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(400).json({
                error: 'Notification not found! Please check your id and try again',
            });
        }

        if (!notification.recipient.equals(req.user._id)) {
            return res.status(401).json({
                error: 'Invalid receipt! You need to be the receipt of the notification',
            });
        }

        res.status(200).json(notification);
    } catch {
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
    }
};

exports.updateNotification = async (req, res) => {
    try {
        // Checking for the read property using the ! symbol will cause unexpected behaviour since it is a boolean
        if (!req.body || req.body.read === undefined) {
            return res.status(400).json({
                error: 'Update details are missing! Please provide some details to update',
            });
        }

        if (!req.params || !req.params.id) {
            return res.status(400).json({
                error: 'Notification id required! Please provide a valid notification id',
            });
        }

        if (!req.user) {
            return res.status(400).json({
                error: 'Recipient required! Please provide the recipient of the notifications',
            });
        }

        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(400).json({
                error: 'Notification not found! Please check your id and try again',
            });
        }

        if (!notification.recipient.equals(req.user._id)) {
            return res.status(401).json({
                error: 'Invalid receipient! You need to be the receipt of the notification',
            });
        }

        // For the integrity of the system, we only allow updating the read notification property
        const updatedNotification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: req.body.read },
            { returnDocument: 'after' },
        );

        if (!updatedNotification) {
            return res.status(400).json({
                error: "Couldn't update notification! Please try again later",
            });
        }

        res.status(200).json(updatedNotification);
    } catch {
        res.status(500).json({ error: 'Something went wrong! Please try again later' });
    }
};
