const User = require('../../authorization/User.js');
const utils = require('../../utils.js');
const controller = require('../../authorization/controller.js');

jest.mock('../../authorization/User.js', () => ({
    findOne: jest.fn(),
}));

jest.mock('../../utils.js', () => ({
    comparePasswords: jest.fn(),
    generateAccessToken: jest.fn(),
}));

describe('Login', () => {
    // TODO: Test what happens when the body is not provided
    it('should get the user by the provided email', async () => {
        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            // TODO: Check if we need this mockReturnThis function
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    });

    it('should return a 401 status when the user is not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return an object with an error property when the user is not found', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should check if passwords are similar', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue({ password: 'test-password' });

        // Mock request object
        const req = { body: { password: 'body-test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        expect(utils.comparePasswords).toHaveBeenCalledWith(req.body.password, 'test-password');
    });

    it('should return a 401 status when the passwords are not similar', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue({ password: 'test-password' });
        // Utils gets mocked, hence the mockReturnValue function exists
        utils.comparePasswords.mockReturnValue(false);

        // Mock request object
        const req = { body: { password: 'test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should return an object with an error property when the passwords are not similar', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);
        // Utils gets mocked, hence the mockReturnValue function exists
        utils.comparePasswords.mockReturnValue(false);

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should generate the access token', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue({ _id: 'test-id' });
        // Utils gets mocked, hence the mockReturnValue function exists
        utils.comparePasswords.mockReturnValue(true);

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        expect(utils.generateAccessToken).toHaveBeenCalledWith(req.body.email, 'test-id');
    });

    it('should return a 200 status on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue({});
        // Utils gets mocked, hence the mockReturnValue function exists
        utils.comparePasswords.mockReturnValue(true);

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return a 500 status on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should return an object with an error property on error', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockRejectedValue(new Error('Test error'));

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.login(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
