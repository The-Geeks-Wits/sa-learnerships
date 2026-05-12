const express = require('express');
const notificationsController = require('./controller.js');
const { isAuthenticated } = require('../middlewares/auth.js');

const router = express.Router();

const getMyNotifications = notificationsController.getMyNotifications;
const getNotification = notificationsController.getNotification;
const updateNotification = notificationsController.updateNotification;

router.get('/mine', isAuthenticated, getMyNotifications);
router.get('/:id', isAuthenticated, getNotification);
router.patch('/:id', isAuthenticated, updateNotification);

module.exports = router;
