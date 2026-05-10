const express = require('express');
const notificationsController = require('./controller.js');
const { isAuthenticated } = require('../middlewares/auth.js');

const router = express.Router();

const getMyNotifications = notificationsController.getMyNotifications;
const getNotificationById = notificationsController.getNotificationById;
const updateNotification = notificationsController.updateNotification;

router.get('/mine', isAuthenticated, getMyNotifications);
router.get('/', isAuthenticated, getMyNotifications);
router.get('/:id', isAuthenticated, getNotificationById);
router.patch('/:id', isAuthenticated, updateNotification);

module.exports = router;
