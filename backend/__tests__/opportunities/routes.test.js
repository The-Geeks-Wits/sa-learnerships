const express = require('express');
const routes = require('../../opportunities/routes.js');
const controller = require('../../opportunities/controller.js');
const middlewares = require('../../middlewares/auth.js');

jest.mock('express', () => {
    const mockRouter = { post: jest.fn(), get: jest.fn() };
    return { Router: jest.fn(() => mockRouter) };
});

// We have tested the controller and assume that it is working as inteded so here we mock it to test everything as a unit
jest.mock('../../opportunities/controller.js', () => ({
    createOpportunity: jest.fn(),
    getOpportunity: jest.fn(),
    getAllOpportunities: jest.fn(),
    approveOpportunity: jest.fn(),
    rejectOpportunity: jest.fn(),
}));

jest.mock('../../middlewares/auth.js', () => ({
    isAuthenticated: jest.fn(),
    isProvider: jest.fn(),
}));

describe('Opportunity Routes', () => {
    it('calls the express router function', () => {
        expect(express.Router).toHaveBeenCalled();
    });

    it('calls the router GET method 3 times', () => {
        const mockRouter = express.Router();
        expect(mockRouter.get).toHaveBeenCalledTimes(3);
    });

    it('calls the router POST method', () => {
        const mockRouter = express.Router();
        expect(mockRouter.post).toHaveBeenCalled();
    });

    it('calls the router GET method with the correct arguments', () => {
        const mockRouter = express.Router();
        expect(mockRouter.get).toHaveBeenCalledWith('/', controller.getAllOpportunities);
        expect(mockRouter.get).toHaveBeenCalledWith('/:id', controller.getOpportunity);
    });

    it('checks if the user is authenticated and is a provider before creating an opportunity', () => {
        const mockRouter = express.Router();
        expect(mockRouter.post).toHaveBeenCalledWith(
            '/',
            middlewares.isAuthenticated,
            middlewares.isProvider,
            controller.createOpportunity,
        );
    });
});
