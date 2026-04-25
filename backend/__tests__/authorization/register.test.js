const User = require('../../authorization/User.js');
const utils = require('../../utils.js');
const controller = require('../../authorization/controller.js');

jest.mock('../../authorization/User.js', () => ({
    findOne: jest.fn(),
    create: jest.fn(),
}));

jest.mock('../../utils.js', () => ({
    isStrong: jest.fn(),
    hashPassword: jest.fn(),
    generateAccessToken: jest.fn(),
}));

describe('Register', () => {
    // TODO: Test what happens when the body is not provided
    it('should check if a user with the provided email already exists', async () => {
        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
    });

    it('should return a 409 status when the user with the given email exists', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue({});

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(res.status).toHaveBeenCalledWith(409);
    });

    it('should return an object with an error property when the user with the given email exists', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue({});

        // Mock request object
        const req = { body: { email: 'test-email' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    // TODO: Test for the case when the fields are not provided
    it('should return a 400 status when the firstName is an empty string', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { firstName: '' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when the firstName is an empty string', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { firstName: '' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 400 status when the password is not the same as confirm password', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { password: 'test-pass', confirmPassword: 'test-pass-2' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when the password is not the same as confirm password', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { password: 'test-pass', confirmPassword: 'test-pass-2' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should return a 400 status when the password is less than 8 characters', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { password: 'test-p', confirmPassword: 'test-p' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when the password is less than 8 characters', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { password: 'test-p', confirmPassword: 'test-p' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should check if the password is strong', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);

        // Mock request object
        const req = { body: { password: 'test-password', confirmPassword: 'test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(utils.isStrong).toHaveBeenCalledWith(req.body.password);
    });

    it('should return a 400 status when the password is not strong', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);
        // The utils file get mocked, hence the mockReturnValue function exists
        utils.isStrong.mockReturnValue(false);

        // Mock request object
        const req = { body: { password: 'test-password', confirmPassword: 'test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return an object with an error property when the password is not strong', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);
        // The utils file get mocked, hence the mockReturnValue function exists
        utils.isStrong.mockReturnValue(false);

        // Mock request object
        const req = { body: { password: 'test-password', confirmPassword: 'test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });

    it('should hash the users password', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);
        // The utils file get mocked, hence the mockReturnValue function exists
        utils.isStrong.mockReturnValue(true);

        // Mock request object
        const req = { body: { password: 'test-password', confirmPassword: 'test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(utils.hashPassword).toHaveBeenCalledWith(req.body.password);
    });

    it('should create the user', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);
        // The utils file get mocked, hence the mockReturnValue function exists
        utils.isStrong.mockReturnValue(true);

        // Mock request object
        const req = { body: { password: 'test-password', confirmPassword: 'test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(User.create).toHaveBeenCalled();
    });

    it('should generate the access token', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);
        User.create.mockResolvedValue({ _id: 'test-id' });
        // The utils file get mocked, hence the mockReturnValue function exists
        utils.isStrong.mockReturnValue(true);

        // Mock request object
        const req = { body: { email: 'test-email', password: 'test-password', confirmPassword: 'test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(utils.generateAccessToken).toHaveBeenCalledWith(req.body.email, 'test-id');
    });

    it('should return a 201 status on success', async () => {
        // User gets mocked, hence the mockResolvedValue function exists
        User.findOne.mockResolvedValue(undefined);
        // The utils file get mocked, hence the mockReturnValue function exists
        utils.isStrong.mockReturnValue(true);

        // Mock request object
        const req = { body: { email: 'test-email', password: 'test-password', confirmPassword: 'test-password' } };

        // Mock response object
        const res = {
            status: jest.fn().mockReturnThis(),
            cookie: jest.fn(),
            json: jest.fn(),
        };

        await controller.register(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
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

        await controller.register(req, res);
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

        await controller.register(req, res);
        const json = res.json.mock.calls[0][0];
        expect(json.error).toBeDefined();
    });
});
