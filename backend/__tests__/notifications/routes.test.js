const express = require('express');
const routes = require('../../notifications/routes.js');
const controller = require('../../notifications/controller.js');
const middlewares = require('../../middlewares/auth.js');

jest.mock('express', () => {
    const mockRouter = { patch: jest.fn(), get: jest.fn() };
    return { Router: jest.fn(() => mockRouter) };
});

// We have tested the controller and assume that it is working as inteded so here we mock it to test everything as a unit
jest.mock('../../opportunities/controller.js', () => ({
    getMyNotifications: jest.fn(),
    getNotification: jest.fn(),
    updateNotification: jest.fn(),
}));

jest.mock('../../middlewares/auth.js', () => ({
    isAuthenticated: jest.fn(),
}));

describe('Notification Routes', () => {
    it('calls the express router function', () => {
        expect(express.Router).toHaveBeenCalled();
    });

    it('calls the router GET method 2 times', () => {
        const mockRouter = express.Router();
        expect(mockRouter.get).toHaveBeenCalledTimes(2);
    });

    it('calls the router PATCH method', () => {
        const mockRouter = express.Router();
        expect(mockRouter.patch).toHaveBeenCalled();
    });

    it('calls the router GET method with the correct arguments', () => {
        const mockRouter = express.Router();
        expect(mockRouter.get).toHaveBeenCalledWith(
            '/mine',
            middlewares.isAuthenticated,
            controller.getMyNotifications,
        );
        expect(mockRouter.get).toHaveBeenCalledWith('/:id', middlewares.isAuthenticated, controller.getNotification);
    });

    it('calls the router PATCH method with the correct arguments', () => {
        const mockRouter = express.Router();
        expect(mockRouter.patch).toHaveBeenCalledWith(
            '/:id',
            middlewares.isAuthenticated,
            controller.updateNotification,
        );
    });
});
