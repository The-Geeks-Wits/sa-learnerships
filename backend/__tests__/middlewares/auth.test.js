const User = require('../../authorization/User.js');
const jwt = require('jsonwebtoken');
const middleware = require('../../middlewares/auth.js');

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

jest.mock('../../authorization/User.js', () => ({
    findById: jest.fn(),
}));

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

describe('Auth - Is Authenticated', () => {
    // TODO: Test what happens when the cookies are not provided
    it('should return a 401 status when there is no token in cookies', async () => {
        // Mock request object
        const req = { cookies: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return an object with a message property when there is no token in cookies', async () => {
        // Mock request object
        const req = { cookies: {} };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    it('should verify and decode the jwt', async () => {
        process.env.JWT_SECRET = 'test-secret';
        // Mock request object
        const req = { cookies: { token: 'test-token' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        expect(jwt.verify).toHaveBeenCalledWith(req.cookies.token, process.env.JWT_SECRET);
    });

    it('should find the user by the decoded id', async () => {
        // jwt gets mocked, hence the mockResolvedValue function exists
        const value = 'test-id';
        jwt.verify.mockReturnValue({ id: value });
        process.env.JWT_SECRET = 'test-secret';

        // Mock request object
        const req = { cookies: { token: 'test-token' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        expect(User.findById).toHaveBeenCalledWith(value);
    });

    it('should return a 401 status code when the user is not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue(undefined);

        // Mock request object
        const req = { cookies: { token: 'test-token' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return an object with a message property when the user is not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue(undefined);

        // Mock request object
        const req = { cookies: { token: 'test-token' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });

    it('should add the user details to the request object', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        const details = { id: 'test-id' };
        User.findById.mockResolvedValue(details);

        // Mock request object
        const req = { cookies: { token: 'test-token' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        expect(req.user).toBe(details);
    });

    it('should call the next function on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockResolvedValue({ id: 'test-id' });

        // Mock request object
        const req = { cookies: { token: 'test-token' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock next function
        const next = jest.fn();

        await middleware.isAuthenticated(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    // TODO: The error status code here should be 500 since it would not be the users falt
    it('should return a 401 status on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { cookies: { token: 'test-token' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return an object with a message property on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findById.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { cookies: { token: 'test-token' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await middleware.isAuthenticated(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.message).toBeDefined();
    });
});
