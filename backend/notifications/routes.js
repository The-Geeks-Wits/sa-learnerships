const express = require('express');
const notificationsController = require('./controller.js');
const { isAuthenticated } = require('../middlewares/auth.js');

const router = express.Router();

const getMyNotifications = notificationsController.getMyNotifications;

router.get('/mine', isAuthenticated, getMyNotifications);

module.exports = router;
