const jwt = require('jsonwebtoken');
const middleware = require('../../middlewares/auth.js');

describe('Auth - Is Admin', () => {
    it('should return a 403 status code when the user is not an admin', () => {
        // Mock request object
        const req = { user: { role: 'test-role' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock next function
        const next = jest.fn();

        middleware.isAdmin(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return an object with a message property when the user is not an admin', () => {
        // Mock request object
        const req = { user: { role: 'test-role' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock next function
        const next = jest.fn();

        middleware.isAdmin(req, res, next);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    it('should call the next function when the user is an admin', () => {
        // Mock request object
        const req = { user: { role: 'admin' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock next function
        const next = jest.fn();

        middleware.isAdmin(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});

describe('Auth - Is Provider', () => {
    it('should return a 403 status code when the user is not a provider', () => {
        // Mock request object
        const req = { user: { role: 'test-role' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock next function
        const next = jest.fn();

        middleware.isProvider(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return an object with a message property when the user is not a provider', () => {
        // Mock request object
        const req = { user: { role: 'test-role' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock next function
        const next = jest.fn();

        middleware.isProvider(req, res, next);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    it('should call the next function when the user is a provider', () => {
        // Mock request object
        const req = { user: { role: 'provider' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock next function
        const next = jest.fn();

        middleware.isProvider(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
