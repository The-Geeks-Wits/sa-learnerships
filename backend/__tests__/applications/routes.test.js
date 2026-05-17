const express = require('express');
const routes = require('../../applications/routes.js');
const controller = require('../../applications/controller.js');
const middlewares = require('../../middlewares/auth.js');

jest.mock('express', () => {
    const mockRouter = { patch: jest.fn(), post: jest.fn(), get: jest.fn() };
    return { Router: jest.fn(() => mockRouter) };
});

// We have tested the controller and assume that it is working as inteded so here we mock it to test everything as a unit
jest.mock('../../opportunities/controller.js', () => ({
    submitApplication: jest.fn(),
    getApplication: jest.fn(),
    getAllApplications: jest.fn(),
    getMyApplications: jest.fn(),
    getProviderApplications: jest.fn(),
    getRejectedApplications: jest.fn(),
    rejectApplication: jest.fn(),
}));

jest.mock('../../middlewares/auth.js', () => ({
    isAuthenticated: jest.fn(),
    isProvider: jest.fn(),
}));

describe('Application Routes', () => {
    it('calls the express router function', () => {
        expect(express.Router).toHaveBeenCalled();
    });

    it('calls the router GET method 5 times', () => {
        const mockRouter = express.Router();
        expect(mockRouter.get).toHaveBeenCalledTimes(5);
    });

    it('calls the router POST method', () => {
        const mockRouter = express.Router();
        expect(mockRouter.post).toHaveBeenCalled();
    });

    it('calls the router PATCH method', () => {
        const mockRouter = express.Router();
        expect(mockRouter.patch).toHaveBeenCalled();
    });
});
